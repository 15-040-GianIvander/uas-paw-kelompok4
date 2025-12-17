from .security import check_password, hash_password, create_token, verify_token
from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import DBAPIError
from .models import User, Event
from .security import check_password, hash_password
from datetime import datetime
import uuid

# --- AUTHENTICATION ---

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        
        # 1. VALIDASI ROLE (Hanya 'admin' atau 'user')
        input_role = data.get('role', '').lower() # Ubah ke huruf kecil semua
        if input_role not in ['admin', 'user']:
            request.response.status = 400
            return {'message': 'Invalid role. Choose "admin" or "user"'}

        # Cek email duplikat
        if request.dbsession.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {'message': 'Email already exists'}

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=input_role # Simpan yang sudah di-lowercase
        )
        
        request.dbsession.add(new_user)
        request.dbsession.flush()
        
        return {'message': 'User created successfully', 'id': new_user.id}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    try:
        data = request.json_body
        user = request.dbsession.query(User).filter_by(email=data['email']).first()
        
        if user and check_password(data['password'], user.password):
            # GENERATE JWT TOKEN
            token = create_token(user.id, user.role)
            
            return {
                'message': 'Login success',
                'token': token,  # <-- Kirim Token ke User
                'user_id': user.id,
                'role': user.role,
                'name': user.name
            }
        
        request.response.status = 401
        return {'message': 'Invalid email or password'}
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}
# --- EVENT MANAGEMENT ---

@view_config(route_name='events', renderer='json', request_method='GET')
def get_events(request):
    # Mengambil semua event (Fitur Browse untuk Attendee)
    events = request.dbsession.query(Event).all()
    return [{
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'date': e.date.isoformat(),
        'location': e.location,
        'capacity': e.capacity,
        'ticket_price': e.ticket_price,
        'organizer_id': e.organizer_id
    } for e in events]

# Helper untuk mengambil data user dari Token Header
def get_user_from_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, "Missing Token"
    
    payload = verify_token(auth_header)
    if not payload:
        return None, "Invalid or Expired Token"
        
    return payload, None # payload berisi {'sub': id, 'role': role}

@view_config(route_name='events', renderer='json', request_method='POST')
def create_event(request):
    try:
        # 1. CEK TOKEN & AUTH
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}
        
        # 2. CEK ROLE (Hanya Admin)
        if user_data['role'] != 'admin':
            request.response.status = 403
            return {'message': 'Forbidden: Only Admin can create events'}

        data = request.json_body
        
        # --- LOGIKA TANGGAL FLEKSIBEL (BARU) ---
        # Menerima format "2025-12-31 19:00" ATAU "2025-12-31T19:00:00"
        raw_date = data['date']
        # Ganti 'T' jadi spasi, dan buang detik/milidetik jika ada
        clean_date = raw_date.replace('T', ' ').split('.')[0]
        if len(clean_date) > 16:
            clean_date = clean_date[:16] # Potong jadi "YYYY-MM-DD HH:MM"
            
        event_date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')
        # ----------------------------------------

        new_event = Event(
            organizer_id=user_data['sub'], # ID dari Token
            title=data['title'],
            description=data.get('description', ''),
            date=event_date, # Pakai tanggal yang sudah bersih
            location=data['location'],
            capacity=int(data['capacity']),
            ticket_price=int(data['ticket_price'])
        )
        
        request.dbsession.add(new_event)
        request.dbsession.flush()
        return {'message': 'Event created successfully', 'id': new_event.id}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# 1. GET Single Event (Lihat Detail 1 Acara)
@view_config(route_name='event_detail', renderer='json', request_method='GET')
def get_event_detail(request):
    event_id = request.matchdict['id']
    event = request.dbsession.query(Event).get(event_id)
    
    if not event:
        request.response.status = 404
        return {'message': 'Event not found'}

    return {
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'date': event.date.isoformat(),
        'location': event.location,
        'capacity': event.capacity,
        'ticket_price': event.ticket_price,
        'organizer_id': event.organizer_id
    }

# 2. PUT Event (Edit/Update Acara)
@view_config(route_name='event_detail', renderer='json', request_method='PUT')
def update_event(request):
    try:
        # 1. CEK TOKEN & AUTH
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        # 2. CEK ROLE (Hanya Admin)
        if user_data['role'] != 'admin':
            request.response.status = 403
            return {'message': 'Forbidden: Only Admin can update events'}

        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        data = request.json_body
        
        # Update field biasa
        if 'title' in data: event.title = data['title']
        if 'description' in data: event.description = data['description']
        if 'location' in data: event.location = data['location']
        if 'capacity' in data: event.capacity = int(data['capacity'])
        if 'ticket_price' in data: event.ticket_price = int(data['ticket_price'])
        
        # --- LOGIKA TANGGAL FLEKSIBEL (BARU) ---
        if 'date' in data:
            raw_date = data['date']
            clean_date = raw_date.replace('T', ' ').split('.')[0]
            if len(clean_date) > 16:
                clean_date = clean_date[:16]
            
            event.date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')
        # ----------------------------------------

        return {'message': 'Event updated successfully'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}
# 3. DELETE Event (Hapus Acara)
@view_config(route_name='event_detail', renderer='json', request_method='DELETE')
def delete_event(request):
    try:
        # 1. CEK TOKEN & AUTH
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        # 2. CEK ROLE (Hanya Admin yang boleh hapus)
        if user_data['role'] != 'admin':
            request.response.status = 403
            return {'message': 'Forbidden: Only Admin can delete events'}

        # 3. CARI & HAPUS EVENT
        event_id = request.matchdict['id']
        event = request.dbsession.query(Event).get(event_id)
        
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        request.dbsession.delete(event)
        return {'message': 'Event deleted successfully'}
        
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}
# --- ADMIN FEATURES ---

@view_config(route_name='users_list', renderer='json', request_method='GET')
def get_all_users(request):
    try:
        # 1. Cek Siapa yang Request?
        # Karena kita belum pakai Token canggih, kita minta ID admin dikirim via Query Param
        # Contoh URL: /api/users?admin_id=X7K9
        admin_id = request.params.get('admin_id')

        if not admin_id:
            request.response.status = 401
            return {'message': 'Unauthorized: Please provide admin_id'}

        # 2. Cek di Database: Apakah ID ini beneran Admin?
        admin = request.dbsession.query(User).get(admin_id)
        if not admin or admin.role != 'admin':
            request.response.status = 403 # Forbidden
            return {'message': 'Access Denied: Only Admins can view user list'}

        # 3. Jika Lolos, Tampilkan Semua User
        users = request.dbsession.query(User).all()
        return [{
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat()
        } for u in users]

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}