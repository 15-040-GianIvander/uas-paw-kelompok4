from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, User, Event, Booking
from datetime import datetime

# Setup koneksi manual
DATABASE_URL = "postgresql://postgres:passwordmu@localhost:5432/ticketing_db"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def seed():
    # 1. Create Organizer
    organizer = User(name="Event Organizer Jkt", email="eo@test.com", password="hashedpassword", role="organizer")
    session.add(organizer)
    session.commit() # Commit agar dapat ID

    # 2. Create Attendee
    attendee = User(name="Budi Santoso", email="budi@test.com", password="hashedpassword", role="attendee")
    session.add(attendee)
    session.commit()

    # 3. Create Event
    event = Event(
        organizer_id=organizer.id,
        name="Konser Musik Indie",
        description="Konser musik paling hits tahun ini",
        date=datetime(2025, 12, 31, 19, 0),
        venue="GBK Senayan",
        capacity=5000,
        ticket_price=150000
    )
    session.add(event)
    session.commit()

    print("✅ Data seeded successfully!")

if __name__ == "__main__":
    seed()