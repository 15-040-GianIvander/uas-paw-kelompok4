from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(200), nullable=False) # Nanti harus di-hash
    role = Column(String(20), nullable=False) # 'organizer' atau 'attendee'
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relasi
    events = relationship("Event", back_populates="organizer")
    bookings = relationship("Booking", back_populates="attendee")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    organizer_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    venue = Column(String(200), nullable=False)
    capacity = Column(Integer, nullable=False)
    ticket_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relasi
    organizer = relationship("User", back_populates="events")
    bookings = relationship("Booking", back_populates="event")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    attendee_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    booking_code = Column(String(50), unique=True, nullable=False)
    booking_date = Column(DateTime, default=datetime.utcnow)

    # Relasi
    event = relationship("Event", back_populates="bookings")
    attendee = relationship("User", back_populates="bookings")