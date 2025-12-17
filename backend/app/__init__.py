from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

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
    
    with Configurator(settings=settings) as config:
        config.registry.dbmaker = sessionmaker(bind=engine)
        config.add_request_method(get_db, 'dbsession', reify=True)

       # --- ROUTING ---
        config.add_route('register', '/api/register')
        config.add_route('login', '/api/login')
        
        # EVENT ROUTES
        config.add_route('events', '/api/events')          
        config.add_route('event_detail', '/api/events/{id}') 

        # ADMIN ROUTE (BARU)
        config.add_route('users_list', '/api/users') # <--- Tambahkan ini
        
        config.scan('.views')
        
    return config.make_wsgi_app()