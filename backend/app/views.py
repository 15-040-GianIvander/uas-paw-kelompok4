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
        # Cek email duplikat
        if request.dbsession.query(User).filter_by(email=data['email']).first():
            request.response.status = 400
            return {'message': 'Email already exists'}

        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hash_password(data['password']),
            role=data['role'] # 'organizer' atau 'attendee'
        )
        request.dbsession.add(new_user)
        request.dbsession.flush()  # Untuk mendapatkan ID sebelum commit
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
            return {
                'message': 'Login success',
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

@view_config(route_name='events', renderer='json', request_method='POST')
def create_event(request):
    try:
        data = request.json_body
        
        # Cek apakah user adalah organizer
        # (Catatan: Di aplikasi real, user_id diambil dari Token/Session, bukan dikirim mentah dari body)
        organizer = request.dbsession.query(User).get(data['organizer_id'])
        if not organizer or organizer.role != 'organizer':
            request.response.status = 403
            return {'message': 'Only organizers can create events'}

        # Parsing tanggal (Format: YYYY-MM-DD HH:MM)
        # Contoh input: "2025-12-31 19:00"
        event_date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M')

        new_event = Event(
            organizer_id=data['organizer_id'],
            title=data['title'],
            description=data.get('description', ''),
            date=event_date,
            location=data['location'],
            capacity=int(data['capacity']),
            ticket_price=int(data['ticket_price'])
        )
        request.dbsession.add(new_event)
        request.dbsession.flush()  # Untuk mendapatkan ID sebelum commit
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
        event_id = request.matchdict['id']
        data = request.json_body
        
        event = request.dbsession.query(Event).get(event_id)
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        # Validasi: Hanya Organizer pemilik event yang boleh edit
        # (Simulasi: cek apakah ID yang dikirim sama dengan pemilik event)
        if data.get('organizer_id') != event.organizer_id:
            request.response.status = 403
            return {'message': 'Not authorized to edit this event'}

        # Update field (jika ada data baru, update. jika tidak, pakai lama)
        if 'title' in data: event.title = data['title']
        if 'description' in data: event.description = data['description']
        if 'location' in data: event.location = data['location']
        if 'capacity' in data: event.capacity = data['capacity']
        if 'ticket_price' in data: event.ticket_price = data['ticket_price']
        
        # Khusus tanggal perlu parsing ulang
        if 'date' in data:
            event.date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M')

        return {'message': 'Event updated successfully'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# 3. DELETE Event (Hapus Acara)
@view_config(route_name='event_detail', renderer='json', request_method='DELETE')
def delete_event(request):
    try:
        event_id = request.matchdict['id']
        # Note: Idealnya ambil user_id dari header/token, tapi untuk sekarang via body/query
        # Kita anggap siapa saja yang tahu ID bisa delete dulu untuk test, 
        # atau boleh kirim organizer_id di body untuk validasi.
        
        event = request.dbsession.query(Event).get(event_id)
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        request.dbsession.delete(event)
        return {'message': 'Event deleted successfully'}
        
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}