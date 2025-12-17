from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Base class untuk models
Base = declarative_base()

def get_engine(settings):
    return create_engine(settings['sqlalchemy.url'])

def get_session_factory(engine):
    return sessionmaker(bind=engine)

def get_tm_session(session_factory, transaction_manager):
    dbsession = session_factory()
    return dbsession