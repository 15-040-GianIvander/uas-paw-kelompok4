from pyramid.view import view_config
from app.models import User, Event, Booking 
from app.views.auth import get_user_from_request
from app.email_utils import send_booking_confirmation

# --- 1. USER: BELI TIKET (Create Booking) ---
@view_config(route_name='bookings', renderer='json', request_method='POST')
def create_booking(request):
    try:
        # Cek Token & Role User
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        if user_data['role'] != 'user':
            request.response.status = 403
            return {'message': 'Forbidden: Only User (Attendee) can book tickets'}

        data = request.json_body
        event_id = data.get('event_id')
        quantity = int(data.get('quantity', 1))

        # Cek Event & Stok
        event = request.dbsession.query(Event).get(event_id)
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        if event.capacity < quantity:
            request.response.status = 400
            return {'message': f'Not enough tickets. Only {event.capacity} left.'}

        # Buat Booking
        total_price = event.ticket_price * quantity
        new_booking = Booking(
            event_id=event.id,
            attendee_id=user_data['sub'],
            quantity=quantity,
            total_price=total_price,
            status="confirmed"
        )

        event.capacity -= quantity
        request.dbsession.add(new_booking)
        request.dbsession.flush()

        # --- TAMBAHAN: KIRIM EMAIL KONFIRMASI ---
        # Kita butuh data email user & nama user
        attendee = request.dbsession.query(User).get(user_data['sub'])
        
        if attendee and attendee.email:
            send_booking_confirmation(
                to_email=attendee.email,
                user_name=attendee.name,
                event_title=event.title,
                booking_code=new_booking.booking_code,
                quantity=quantity,
                total_price=total_price
            )
        # ----------------------------------------

        return {
            'message': 'Booking successful! Email confirmation sent.',
            'booking_id': new_booking.id,
            'booking_code': new_booking.booking_code,
            'total_price': total_price
        }

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}


# --- 2. USER: LIHAT HISTORY SENDIRI (View History) ---
@view_config(route_name='my_bookings', renderer='json', request_method='GET')
def get_my_bookings(request):
    try:
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        # Query hanya booking milik user yang login
        my_bookings = request.dbsession.query(Booking)\
            .filter_by(attendee_id=user_data['sub'])\
            .order_by(Booking.booking_date.desc()).all()

        results = []
        for b in my_bookings:
            results.append({
                'id': b.id,
                'booking_code': b.booking_code,
                'event_title': b.event.title if b.event else "Unknown Event",
                'event_date': b.event.date.isoformat() if b.event else None,
                'quantity': b.quantity,
                'total_price': b.total_price,
                'status': b.status,
                'booking_date': b.booking_date.isoformat()
            })

        return results

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}


# --- 3. ADMIN: LIHAT SEMUA BOOKING (Booking Management) ---
# Fitur Baru: Admin bisa melihat siapa saja yang booking
@view_config(route_name='all_bookings', renderer='json', request_method='GET')
def get_all_bookings(request):
    try:
        # A. Cek Token & Role Admin
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        if user_data['role'] != 'admin':
            request.response.status = 403
            return {'message': 'Forbidden: Only Admin can view booking data'}

        # B. Siapkan Query
        query = request.dbsession.query(Booking)

        # C. Filter (Opsional): Admin mau lihat peserta event tertentu saja?
        # Contoh URL: /api/admin/bookings?event_id=A1B2
        filter_event_id = request.params.get('event_id')
        if filter_event_id:
            query = query.filter(Booking.event_id == filter_event_id)

        # Urutkan dari yang terbaru
        bookings = query.order_by(Booking.booking_date.desc()).all()

        # D. Format Hasil (Sertakan Data Peserta/Attendee)
        results = []
        for b in bookings:
            results.append({
                'booking_id': b.id,
                'booking_code': b.booking_code,
                'event_title': b.event.title if b.event else "Unknown",
                # Data Attendee (Peserta)
                'attendee_name': b.attendee.name if b.attendee else "Unknown",
                'attendee_email': b.attendee.email if b.attendee else "-",
                'quantity': b.quantity,
                'total_price': b.total_price,
                'status': b.status,
                'booking_date': b.booking_date.isoformat()
            })

        return results

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}