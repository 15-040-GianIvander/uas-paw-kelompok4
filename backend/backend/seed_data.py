import os
from datetime import datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import User, Event
from app.security import hash_password

def _get_database_url():
    db_url = os.getenv('DATABASE_URL', '')
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    return db_url

def seed():
    db_url = _get_database_url()
    if not db_url:
        raise RuntimeError('DATABASE_URL is not set')

    engine = create_engine(db_url)
    Session = sessionmaker(bind=engine)
    session = Session()

    admin_email = os.getenv('SEED_ADMIN_EMAIL', 'admin@example.com')
    admin_password = os.getenv('SEED_ADMIN_PASSWORD', 'admin123')
    admin_name = os.getenv('SEED_ADMIN_NAME', 'Admin')
    admin_role = os.getenv('SEED_ADMIN_ROLE', 'superadmin')

    admin = session.query(User).filter_by(email=admin_email).first()
    if not admin:
        admin = User(
            name=admin_name,
            email=admin_email,
            password=hash_password(admin_password),
            role=admin_role,
        )
        session.add(admin)
        session.commit()

    events = [
        {
            'title': 'Konser Musik Indie',
            'description': 'Konser musik paling hits tahun ini',
            'date': datetime.utcnow() + timedelta(days=30),
            'location': 'GBK Senayan',
            'capacity': 5000,
            'ticket_price': 150000,
        },
        {
            'title': 'Festival Kuliner Nusantara',
            'description': 'Jelajah rasa kuliner dari berbagai daerah',
            'date': datetime.utcnow() + timedelta(days=45),
            'location': 'Lapangan Banteng',
            'capacity': 2000,
            'ticket_price': 75000,
        },
    ]

    created = 0
    for data in events:
        existing = session.query(Event).filter_by(title=data['title']).first()
        if existing:
            continue
        session.add(Event(organizer_id=admin.id, **data))
        created += 1

    if created:
        session.commit()

    session.close()
    print(f'Seed complete. New events: {created}')

if __name__ == '__main__':
    seed()
