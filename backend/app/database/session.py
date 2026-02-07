from sqlmodel import create_engine, Session
from app.core.config import settings
from typing import Generator


# Create database engine
# For SQLite, we need to configure it differently than for PostgreSQL
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite specific configuration for better compatibility
    engine = create_engine(
        settings.DATABASE_URL,
        echo=False,  # Set to True for debugging SQL queries
        connect_args={
            "check_same_thread": False,  # Required for multi-threading
            "timeout": 30  # Add timeout to prevent hanging
        }
    )
else:
    # Configuration for PostgreSQL or other databases
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=settings.DB_POOL_SIZE,
        pool_timeout=settings.DB_POOL_TIMEOUT,
        echo=False  # Set to True for debugging SQL queries
    )


def get_session() -> Generator[Session, None, None]:
    """
    Get database session for dependency injection
    """
    with Session(engine) as session:
        yield session