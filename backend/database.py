from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.pool import Pool
from config import settings
import models

# Create engine
engine = create_engine(settings.DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session

# Listen for connection events to handle Neon connection timeouts
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set SQLite pragmas for Neon compatibility if using SQLite"""
    if 'sqlite' in settings.DATABASE_URL:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()