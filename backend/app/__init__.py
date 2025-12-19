from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
import os

def get_db(request):
    maker = request.registry.dbmaker
    session = maker()
    def cleanup(request):
        if request.exception is not None:
            session.rollback()
        else:
            session.commit()
        session.close()
    request.add_finished_callback(cleanup)
    return session

def main(global_config, **settings):
    # Setup Database
    engine = engine_from_config(settings, 'sqlalchemy.')

    base_dir = os.path.dirname(os.path.abspath(__file__)) 
    upload_dir = os.path.join(base_dir, 'static', 'uploads')
    
    # Buat foldernya jika belum ada
    os.makedirs(upload_dir, exist_ok=True)
    
    # Simpan lokasi folder ini di registry agar bisa dipakai di views.py nanti
    settings['upload_dir'] = upload_dir
    
    with Configurator(settings=settings) as config:
        config.registry.dbmaker = sessionmaker(bind=engine)
        config.add_request_method(get_db, 'dbsession', reify=True)

        # Ini agar gambar bisa diakses via URL: http://localhost:6543/static/uploads/namafile.jpg
        config.add_static_view(name='static', path='app:static')

        # --- ROUTE PROFILE (BARU) ---
        config.add_route('profile', '/api/profile') # Bisa GET (Lihat) & POST (Edit)
        # ----------------------------

       # --- ROUTING ---
        config.add_route('register', '/api/register')
        config.add_route('login', '/api/login')
        config.add_route('logout', '/api/logout')

        # FORGOT PASSWORD ROUTES (BARU)
        config.add_route('forgot_password', '/api/forgot-password')
        config.add_route('reset_password', '/api/reset-password')
        
        # EVENT ROUTES
        config.add_route('events', '/api/events')          
        config.add_route('event_detail', '/api/events/{id}') 

        # ADMIN ROUTE (BARU)
        config.add_route('users_list', '/api/users') 

        # BOOKING ROUTES (BARU)
        config.add_route('bookings', '/api/bookings')          # Tahap 1: Create
        config.add_route('pay_booking', '/api/bookings/{id}/pay') # Tahap 2: Confirm
        config.add_route('my_bookings', '/api/my-bookings')   # GET (Lihat Tiket Saya)
        
        # Route untuk Admin melihat semua booking/attendee
        config.add_route('all_bookings', '/api/admin/bookings')

            # --- ROUTE SUPERADMIN ---
        # GET (List) & POST (Add New)
        config.add_route('manage_users', '/api/superadmin/users')
        
        # PUT (Update Role) & DELETE (Hapus)
        config.add_route('manage_user_detail', '/api/superadmin/users/{id}')
        # ------------------------
        
        config.scan('.views')
        
    return config.make_wsgi_app()