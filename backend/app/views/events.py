from pyramid.view import view_config
from datetime import datetime
from app.models import User, Event
from app.views.auth import get_user_from_request # Import helper Auth

# --- PUBLIC ROUTES (Bisa diakses siapa saja/Attendee) ---

@view_config(route_name='events', renderer='json', request_method='GET')
def get_events(request):
    try:
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

# --- ADMIN ROUTES (Butuh Token & Role Admin) ---

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
        
        # --- LOGIKA TANGGAL FLEKSIBEL ---
        raw_date = data['date']
        # Ganti 'T' jadi spasi, dan buang detik/milidetik jika ada
        clean_date = raw_date.replace('T', ' ').split('.')[0]
        if len(clean_date) > 16:
            clean_date = clean_date[:16] # Potong jadi "YYYY-MM-DD HH:MM"
            
        event_date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')
        # -------------------------------

        new_event = Event(
            organizer_id=user_data['sub'], # ID dari Token
            title=data['title'],
            description=data.get('description', ''),
            date=event_date,
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
        
        # --- LOGIKA TANGGAL FLEKSIBEL ---
        if 'date' in data:
            raw_date = data['date']
            clean_date = raw_date.replace('T', ' ').split('.')[0]
            if len(clean_date) > 16:
                clean_date = clean_date[:16]
            
            event.date = datetime.strptime(clean_date, '%Y-%m-%d %H:%M')
        # -------------------------------

        return {'message': 'Event updated successfully'}

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='event_detail', renderer='json', request_method='DELETE')
def delete_event(request):
    try:
        # 1. CEK TOKEN & AUTH
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        # 2. CEK ROLE (Hanya Admin)
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