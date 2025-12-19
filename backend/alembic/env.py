import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# --- FIX PATH ---
# Menambahkan folder parent (backend/) ke sys.path agar folder 'app' terbaca
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

# --- IMPORT MODEL ---
# Import Base dan Models dari app.models (BUKAN app.database)
from app.models import Base, User, Event, Booking 

# Konfigurasi Alembic
config = context.config

def _get_database_url():
    db_url = os.getenv('DATABASE_URL', '')
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    return db_url

db_url = _get_database_url()
if db_url:
    config.set_main_option('sqlalchemy.url', db_url)

# Setup Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --- SET METADATA ---
# Ini penting agar Alembic bisa mendeteksi perubahan tabel
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
