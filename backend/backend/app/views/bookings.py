from pyramid.view import view_config
from app.models import User, Event, Booking 
from app.views.auth import get_user_from_request
from app.email_utils import send_booking_confirmation
from datetime import datetime
import random

# --- TAHAP 1: BOOKING AWAL (STATUS PENDING) ---
# Di sini kita CUMA simpan data & generate info pembayaran.
# JANGAN kirim email tiket di sini.
@view_config(route_name='bookings', renderer='json', request_method='POST')
def create_booking(request):
    try:
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}

        data = request.json_body
        event_id = data.get('event_id')
        quantity = int(data.get('quantity', 1))
        
        # Ambil input tambahan dari Frontend
        whatsapp = data.get('whatsapp', '-') 
        payment_method = data.get('payment_method', 'qris') 

        # 1. Validasi Event & Stok
        event = request.dbsession.query(Event).get(event_id)
        if not event:
            request.response.status = 404
            return {'message': 'Event not found'}

        if event.capacity < quantity:
            request.response.status = 400
            return {'message': f'Not enough tickets. Only {event.capacity} left.'}

        total_price = event.ticket_price * quantity

        # 2. GENERATE INFO PEMBAYARAN DUMMY
        payment_details = ""
        
        if payment_method == 'qris':
            # Link QR Code Dummy
            payment_details = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
        else:
            # Generate Virtual Account Palsu (8801 + Angka Acak)
            random_digits = ''.join(["{}".format(random.randint(0, 9)) for num in range(0, 10)])
            payment_details = f"8801{random_digits}"

        # 3. SIMPAN KE DB (STATUS: PENDING)
        new_booking = Booking(
            event_id=event.id,
            attendee_id=user_data['sub'],
            quantity=quantity,
            total_price=total_price,
            status="pending",              # <--- PENTING: Masih Pending
            whatsapp=whatsapp,
            payment_method=payment_method,
            payment_details=payment_details
        )

        event.capacity -= quantity
        request.dbsession.add(new_booking)
        request.dbsession.flush()

        # 4. RETURN INFO KE FRONTEND (Agar Frontend bisa redirect ke Page Pembayaran)
        return {
            'message': 'Booking created. Waiting for payment.',
            'booking_id': new_booking.id,
            'status': 'pending',
            'payment_info': {
                'method': payment_method,
                'details': payment_details, # Frontend akan menampilkan Gambar QR atau Nomor VA ini
                'total_price': total_price
            }
        }
        # TIKET BELUM DIKIRIM!

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}


# --- TAHAP 2: KONFIRMASI PEMBAYARAN (ACTION USER) ---
# Endpoint ini dipanggil saat user klik tombol "Saya Sudah Membayar" di Frontend
@view_config(route_name='pay_booking', renderer='json', request_method='POST')
def pay_booking(request):
    try:
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}

        # Ambil ID Booking dari URL
        booking_id = request.matchdict['id']
        booking = request.dbsession.query(Booking).get(booking_id)

        if not booking:
            request.response.status = 404
            return {'message': 'Booking not found'}

        # Validasi kepemilikan
        if booking.attendee_id != user_data['sub']:
            request.response.status = 403
            return {'message': 'Forbidden'}

        # Cek kalau sudah bayar, jangan kirim email lagi
        if booking.status == 'confirmed':
            return {'message': 'Booking already paid'}

        # 1. UPDATE STATUS JADI CONFIRMED
        booking.status = 'confirmed'
        request.dbsession.flush()

        # 2. BARU KIRIM EMAIL TIKET DI SINI!
        attendee = booking.attendee
        event = booking.event
        
        if attendee and attendee.email:
            send_booking_confirmation(
                to_email=attendee.email,
                user_name=attendee.name,
                event_title=event.title,
                booking_code=booking.booking_code,
                quantity=booking.quantity,
                total_price=booking.total_price
            )

        return {
            'message': 'Payment confirmed! Ticket sent to email.',
            'status': 'confirmed',
            'booking_code': booking.booking_code
        }

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}


# --- HISTORY (VIEW BOOKINGS) ---
@view_config(route_name='my_bookings', renderer='json', request_method='GET')
def get_my_bookings(request):
    try:
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}

        my_bookings = request.dbsession.query(Booking)\
            .filter_by(attendee_id=user_data['sub'])\
            .order_by(Booking.booking_date.desc()).all()

        results = []
        for b in my_bookings:
            results.append({
                'id': b.id,
                'booking_code': b.booking_code,
                'event_title': b.event.title if b.event else "Unknown",
                'event_date': b.event.date.isoformat() if b.event else None,
                'quantity': b.quantity,
                'total_price': b.total_price,
                'status': b.status,   # Frontend pakai ini untuk bedakan warna (Kuning/Hijau)
                'booking_date': b.booking_date.isoformat(),
                'payment_method': b.payment_method,
                'payment_details': b.payment_details,
                'invoice_number': f"#INV-{b.booking_date.year}{b.booking_code}"
            })

        return results

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

# --- ADMIN VIEW (GET ALL) ---
@view_config(route_name='all_bookings', renderer='json', request_method='GET')
def get_all_bookings(request):
    try:
        user_data, error = get_user_from_request(request)
        if error: return {'message': error}
        if user_data['role'] != 'admin': return {'message': 'Forbidden'}

        bookings = request.dbsession.query(Booking).order_by(Booking.booking_date.desc()).all()
        results = []
        for b in bookings:
            results.append({
                'booking_id': b.id,
                'booking_code': b.booking_code,
                'event_title': b.event.title if b.event else "Unknown",
                'attendee_name': b.attendee.name if b.attendee else "Unknown",
                'status': b.status,
                'total_price': b.total_price,
                'payment_method': b.payment_method
            })
        return results

    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}