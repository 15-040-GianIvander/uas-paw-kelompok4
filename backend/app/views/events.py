from pyramid.view import view_config
from datetime import datetime
from app.models import User, Event
from app.views.auth import get_user_from_request
import os
import uuid
import shutil

# --- HELPER FUNCTIONS UNTUK GAMBAR ---

def get_image_url(request, filename):
    """Membuat URL lengkap agar gambar bisa diakses frontend"""
    if not filename:
        return None
    # Hasilnya: http://localhost:6543/static/uploads/namafile.jpg
    return request.static_url(f'app:static/uploads/{filename}')

def save_uploaded_file(request, file_input):
    """
    Menerima input file dari form, membuat nama unik, dan menyimpannya ke disk.
    Mengembalikan nama file baru.
    """
    # Validasi ekstensi sederhana
    filename = file_input.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.gif']:
        raise Exception("Invalid image format. Only JPG, PNG, and GIF allowed.")

    # Buat nama file unik pakai UUID agar tidak bentrok
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    
    # Ambil lokasi folder upload dari setting di __init__.py
    upload_dir = request.registry.settings['upload_dir']
    file_path = os.path.join(upload_dir, unique_filename)

    # Simpan file fisik ke disk
    # file_input.file adalah objek file aslinya
    with open(file_path, 'wb') as output_file:
        shutil.copyfileobj(file_input.file, output_file)

    return unique_filename

def delete_image_file(request, filename):
    """Menghapus file fisik dari disk jika ada (dipakai saat update/delete event)"""
    if not filename:
        return
    upload_dir = request.registry.settings['upload_dir']
    file_path = os.path.join(upload_dir, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

# -------------------------------------


# --- PUBLIC ROUTES (GET) ---

@view_config(route_name='events', renderer='json', request_method='GET')
def get_events(request):
    try:
        events = request.dbsession.query(Event).all()
        return [{
            'id': e.id,
            'title': e.title,
            # Tambahkan URL gambar di respon
            'image_url': get_image_url(request, e.image_filename),
            'description': e.description,
            'date': e.date.isoformat(),
            'location': e.location,
            'capacity': e.capacity,
            'ticket_price': e.ticket_price,
            'organizer_id': e.organizer_id
        } for e in events]
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='GET')
def get_event_detail(request):
    try:
        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        return {
            'id': event.id,
            'title': event.title,
            # Tambahkan URL gambar di respon detail juga
            'image_url': get_image_url(request, event.image_filename),
            'description': event.description,
            'date': event.date.isoformat(),
            'location': event.location,
            'capacity': event.capacity,
            'ticket_price': event.ticket_price,
            'organizer_id': event.organizer_id
        }
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- ADMIN ROUTES (CREATE & UPDATE dengan GAMBAR) ---

@view_config(route_name='events', renderer='json', request_method='POST')
def create_event(request):
    try:
        # 1. CEK AUTH & ROLE (Tetap sama)
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}
        if user_data['role'] != 'admin': return {'message': 'Forbidden'}

        # 2. AMBIL DATA DARI FORM-DATA (Bukan JSON lagi!)
        # Gunakan request.POST untuk data teks biasa
        data = request.POST 

        # --- LOGIKA TANGGAL (Sama) ---
        raw_date = data['date']
        clean_date = raw_date.replace('T', ' ').split('.')[0]
        if len(clean_date) > 16: clean_date = clean_date[:16]
        event_date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')
        # -----------------------------

        # --- LOGIKA UPLOAD GAMBAR (BARU) ---
        image_filename = None
        # Cek apakah ada input dengan key 'image' dan apakah itu file
        if 'image' in request.POST and hasattr(request.POST['image'], 'filename'):
             image_input = request.POST['image']
             # Panggil helper untuk simpan file
             image_filename = save_uploaded_file(request, image_input)
        # -----------------------------------

        new_event = Event(
            organizer_id=user_data['sub'],
            title=data['title'],
            description=data.get('description', ''),
            # Simpan nama filenya ke database
            image_filename=image_filename, 
            date=event_date,
            location=data['location'],
            # Data dari POST itu string semua, harus di-int() manual
            capacity=int(data['capacity']),
            ticket_price=int(data['ticket_price'])
        )
        
        request.dbsession.add(new_event)
        request.dbsession.flush()
        
        # Kembalikan URL gambar agar bisa langsung ditampilkan di frontend
        return {
            'message': 'Event created successfully', 
            'id': new_event.id,
            'image_url': get_image_url(request, image_filename)
        }

    except Exception as e:
        # Hapus file gambar jika database gagal disimpan (agar tidak nyampah)
        if 'image_filename' in locals() and image_filename:
             delete_image_file(request, image_filename)
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='PUT')
def update_event(request):
    try:
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}
        if user_data['role'] != 'admin': return {'message': 'Forbidden'}

        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        if not event: return {'message': 'Event not found'}

        # Gunakan request.POST karena frontend mungkin mengirim file
        data = request.POST
        
        # Update field biasa (cek dulu ketersediaannya di data)
        if 'title' in data: event.title = data['title']
        if 'description' in data: event.description = data['description']
        if 'location' in data: event.location = data['location']
        # Ingat di-int() karena POST mengirim string
        if 'capacity' in data: event.capacity = int(data['capacity'])
        if 'ticket_price' in data: event.ticket_price = int(data['ticket_price'])
        
        # --- UPDATE GAMBAR (BARU) ---
        # Cek apakah admin mengupload gambar baru?
        if 'image' in request.POST and hasattr(request.POST['image'], 'filename'):
             image_input = request.POST['image']
             
             # 1. Hapus gambar lama dulu dari disk (jika ada)
             if event.image_filename:
                 delete_image_file(request, event.image_filename)
                 
             # 2. Simpan gambar baru
             new_filename = save_uploaded_file(request, image_input)
             
             # 3. Update nama file di database
             event.image_filename = new_filename
        # ----------------------------

        # Logika tanggal
        if 'date' in data:
            raw_date = data['date']
            clean_date = raw_date.replace('T', ' ').split('.')[0]
            if len(clean_date) > 16: clean_date = clean_date[:16]
            event.date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')

        return {
            'message': 'Event updated successfully',
            # Kembalikan URL gambar terbaru
            'image_url': get_image_url(request, event.image_filename)
        }

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='DELETE')
def delete_event(request):
    try:
        # ... (Auth sama) ...
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}
        if user_data['role'] != 'admin': return {'message': 'Forbidden'}

        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        if not event: return {'message': 'Event not found'}

        # --- TAMBAHAN: HAPUS FILE GAMBAR FISIK ---
        if event.image_filename:
            delete_image_file(request, event.image_filename)
        # -----------------------------------------

        request.dbsession.delete(event)
        return {'message': 'Event and image deleted successfully'}
        
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}