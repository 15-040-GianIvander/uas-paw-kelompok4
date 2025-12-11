from sqlalchemy import create_engine, text
from app.models import Base

# Koneksi ke database
engine = create_engine('postgresql://Kel_4:Admin123@localhost:5432/ticketing_db')

with engine.connect() as conn:
    # 1. Hapus tabel version (sumber masalahmu)
    conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
    print("✅ Tabel 'alembic_version' berhasil dihapus.")

    # 2. Hapus tabel-tabel lain agar bersih total
    conn.execute(text("DROP TABLE IF EXISTS bookings CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS events CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
    conn.commit()
    print("✅ Semua tabel lama berhasil dihapus.")