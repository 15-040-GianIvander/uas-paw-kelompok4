from pyramid.config import Configurator
from .models import get_engine, get_session_factory

def main(global_config, **settings):
    """Application entry point"""
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    with Configurator(settings=settings) as config:
        config.registry['dbsession_factory'] = session_factory
        config.add_request_method(
            lambda request: session_factory(),
            'dbsession',
            reify=True
        )
        
        # Routes placeholder
        config.include('.routes')
        config.scan()
        
    return config.make_wsgi_app()