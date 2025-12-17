from pyramid.view import view_config
from datetime import datetime
# Perhatikan importnya berubah jadi 'app.models' atau '..models'
from app.models import User, Event, Booking 
from app.views.auth import get_user_from_request # Kita perlu import helper ini

@view_config(route_name='bookings', renderer='json', request_method='POST')
def create_booking(request):
    try:
        # 1. CEK TOKEN
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        # 2. CEK ROLE
        if user_data['role'] != 'user':
            request.response.status = 403
            return {'message': 'Forbidden: Only User (Attendee) can book tickets'}

        data = request.json_body
        event_id = data.get('event_id')
        quantity = int(data.get('quantity', 1))

        # 3. LOGIKA BOOKING
        event = request.dbsession.query(Event).get(event_id)
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        if event.capacity < quantity:
            request.response.status = 400
            return {'message': f'Not enough tickets. Only {event.capacity} left.'}

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

        return {
            'message': 'Booking successful!',
            'booking_id': new_booking.id,
            'booking_code': new_booking.booking_code,
            'total_price': total_price
        }

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='my_bookings', renderer='json', request_method='GET')
def get_my_bookings(request):
    try:
        user_data, error = get_user_from_request(request)
        if error:
            request.response.status = 401
            return {'message': error}

        my_bookings = request.dbsession.query(Booking)\
            .filter_by(attendee_id=user_data['sub'])\
            .order_by(Booking.booking_date.desc()).all()

        results = []
        for b in my_bookings:
            event_title = b.event.title if b.event else "Unknown Event"
            event_date = b.event.date.isoformat() if b.event else None
            
            results.append({
                'id': b.id,
                'booking_code': b.booking_code,
                'event_title': event_title,
                'event_date': event_date,
                'quantity': b.quantity,
                'total_price': b.total_price,
                'status': b.status,
                'booking_date': b.booking_date.isoformat()
            })

        return results

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}