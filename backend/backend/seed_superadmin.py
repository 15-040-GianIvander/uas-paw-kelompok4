from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from app.models import User
from app.security import hash_password
import sys

def seed():
    config_uri = 'development.ini'
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    engine = engine_from_config(settings, 'sqlalchemy.')
    Session = sessionmaker(bind=engine)
    session = Session()

    print("--- MEMBUAT AKUN SUPERADMIN ---")
    name = input("Nama: ")
    email = input("Email: ")
    password = input("Password: ")

    # Cek apakah email sudah ada
    if session.query(User).filter_by(email=email).first():
        print(" Email sudah terdaftar!")
        return

    superadmin = User(
        name=name,
        email=email,
        password=hash_password(password),
        role='superadmin' # <--- Role Spesial
    )

    session.add(superadmin)
    session.commit()
    print(f" Berhasil! Superadmin '{email}' telah dibuat.")

if __name__ == '__main__':
    seed()