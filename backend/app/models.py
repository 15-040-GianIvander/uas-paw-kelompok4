from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
import uuid
from datetime import datetime

# Base Model
Base = declarative_base()

# Tabel Users (Pengguna)
class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'organizer' atau 'attendee'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relasi
    events = relationship("Event", back_populates="organizer")
    bookings = relationship("Booking", back_populates="attendee")

# Tabel Events (Acara)
class Event(Base):
    __tablename__ = 'events'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organizer_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    ticket_price = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relasi
    organizer = relationship("User", back_populates="events")
    bookings = relationship("Booking", back_populates="event")

# Tabel Bookings (Pemesanan)
class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey('events.id'))
    attendee_id = Column(String, ForeignKey('users.id'))
    booking_code = Column(String, unique=True)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(String, default="confirmed") 
    booking_date = Column(DateTime, default=datetime.utcnow)
    
    # Relasi
    event = relationship("Event", back_populates="bookings")
    attendee = relationship("User", back_populates="bookings")