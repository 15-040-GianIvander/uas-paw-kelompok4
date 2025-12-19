from pyramid.view import view_config
from datetime import datetime
from app.models import User, Event
from app.views.auth import get_user_from_request

# --- IMPORT BARU (Mengambil fungsi dari file_utils.py) ---
from app.file_utils import save_uploaded_file, delete_image_file, get_image_url
# --------------------------------------------------------

# --- PUBLIC ROUTES (GET) ---

@view_config(route_name='events', renderer='json', request_method='GET')
def get_events(request):
    try:
        events = request.dbsession.query(Event).all()
        return [{
            'id': e.id,
            'title': e.title,
            # Fungsi get_image_url sekarang diambil dari file_utils.py
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
        # 1. CEK AUTH & ROLE
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}
        if user_data['role'] not in ['admin', 'superadmin']:
            request.response.status = 403
            return {'message': 'Forbidden'}

        # 2. AMBIL DATA DARI FORM-DATA
        data = request.POST 

        # --- LOGIKA TANGGAL ---
        raw_date = data['date']
        clean_date = raw_date.replace('T', ' ').split('.')[0]
        if len(clean_date) > 16: clean_date = clean_date[:16]
        event_date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')

        # --- LOGIKA UPLOAD GAMBAR ---
        image_filename = None
        if 'image' in request.POST and hasattr(request.POST['image'], 'filename'):
             image_input = request.POST['image']
             # Fungsi ini sekarang diambil dari file_utils.py
             image_filename = save_uploaded_file(request, image_input)
        # ----------------------------

        new_event = Event(
            organizer_id=user_data['sub'],
            title=data['title'],
            description=data.get('description', ''),
            image_filename=image_filename, 
            date=event_date,
            location=data['location'],
            capacity=int(data['capacity']),
            ticket_price=int(data['ticket_price'])
        )
        
        request.dbsession.add(new_event)
        request.dbsession.flush()
        
        return {
            'message': 'Event created successfully', 
            'id': new_event.id,
            'image_url': get_image_url(request, image_filename)
        }

    except Exception as e:
        # Hapus file jika gagal simpan DB (Fungsi dari file_utils.py)
        if 'image_filename' in locals() and image_filename:
             delete_image_file(request, image_filename)
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='PUT')
def update_event(request):
    try:
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}
        if user_data['role'] not in ['admin', 'superadmin']:
            request.response.status = 403
            return {'message': 'Forbidden'}

        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        if not event: return {'message': 'Event not found'}

        data = request.POST
        
        if 'title' in data: event.title = data['title']
        if 'description' in data: event.description = data['description']
        if 'location' in data: event.location = data['location']
        if 'capacity' in data: event.capacity = int(data['capacity'])
        if 'ticket_price' in data: event.ticket_price = int(data['ticket_price'])
        
        # --- UPDATE GAMBAR ---
        if 'image' in request.POST and hasattr(request.POST['image'], 'filename'):
             image_input = request.POST['image']
             
             # Hapus gambar lama (Fungsi dari file_utils.py)
             if event.image_filename:
                 delete_image_file(request, event.image_filename)
                 
             # Simpan gambar baru (Fungsi dari file_utils.py)
             new_filename = save_uploaded_file(request, image_input)
             event.image_filename = new_filename
        # ---------------------

        if 'date' in data:
            raw_date = data['date']
            clean_date = raw_date.replace('T', ' ').split('.')[0]
            if len(clean_date) > 16: clean_date = clean_date[:16]
            event.date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')

        return {
            'message': 'Event updated successfully',
            'image_url': get_image_url(request, event.image_filename)
        }

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='DELETE')
def delete_event(request):
    try:
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}
        if user_data['role'] not in ['admin', 'superadmin']:
            request.response.status = 403
            return {'message': 'Forbidden'}

        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        if not event: return {'message': 'Event not found'}

        # --- HAPUS FILE FISIK ---
        if event.image_filename:
            # Fungsi dari file_utils.py
            delete_image_file(request, event.image_filename)
        # ------------------------

        request.dbsession.delete(event)
        return {'message': 'Event and image deleted successfully'}
        
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}