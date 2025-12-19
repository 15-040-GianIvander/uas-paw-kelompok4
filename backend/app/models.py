from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import string
import random

Base = declarative_base()

# Fungsi pembuat ID 4 Karakter (Huruf Besar + Angka)
def generate_short_id():
    chars = string.ascii_uppercase + string.digits # A-Z dan 0-9
    return ''.join(random.choices(chars, k=4))

class User(Base):
    __tablename__ = 'users'
    # ID otomatis panggil fungsi di atas
    id = Column(String, primary_key=True, default=generate_short_id)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    bio = Column(String, nullable=True)          # Untuk "Bio Singkat"
    phone_number = Column(String, nullable=True) # Untuk "Nomor Telepon"
    location = Column(String, nullable=True)     # Untuk "Domisili / Lokasi"
    profile_picture = Column(String, nullable=True) # Untuk "Foto Profil"
    
    # --- FORGOT PASSWORD ---
    reset_token = Column(String, nullable=True)        # Menyimpan kode unik   
    reset_token_expiry = Column(DateTime, nullable=True) # Menyimpan waktu expired
    # --------------------------------------

    events = relationship("Event", back_populates="organizer")
    bookings = relationship("Booking", back_populates="attendee")

class Event(Base):
    __tablename__ = 'events'
    id = Column(String, primary_key=True, default=generate_short_id)
    organizer_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    ticket_price = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    # --- TAMBAHAN UNTUK UPLOAD GAMBAR EVENT ---
    image_filename = Column(String, nullable=True) 
    # ----------------------------------
    
    organizer = relationship("User", back_populates="events")
    bookings = relationship("Booking", back_populates="event")

class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(String, primary_key=True, default=generate_short_id)
    event_id = Column(String, ForeignKey('events.id'))
    attendee_id = Column(String, ForeignKey('users.id'))
    booking_code = Column(String, unique=True, default=generate_short_id) # Booking code juga 4 char
    quantity = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(String, default="confirmed") 
    booking_date = Column(DateTime, default=datetime.utcnow)
    
    event = relationship("Event", back_populates="bookings")
    attendee = relationship("User", back_populates="bookings")