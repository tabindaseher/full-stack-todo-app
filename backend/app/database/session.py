import os
from sqlmodel import create_engine, Session
from app.core.config import settings
from typing import Generator


def get_persistent_db_path():
    """Get a persistent database path for Hugging Face Spaces"""
    # Since we're using PostgreSQL in the live environment, we don't need to modify the path
    # Only apply SQLite-specific persistence logic for SQLite databases
    if settings.DATABASE_URL.startswith("sqlite") and settings.is_hf_space:
        # In Hugging Face Spaces, use a path that persists
        # Create data directory if it doesn't exist
        data_dir = "/data" if os.path.exists("/data") else "./data"
        if not os.path.exists(data_dir):
            os.makedirs(data_dir, exist_ok=True)
        
        # Use persistent database file
        db_path = os.path.join(data_dir, "todo_app.db")
        return f"sqlite:///{db_path}"
    else:
        # For local development or non-SQLite databases, use the original path
        return settings.DATABASE_URL


# Determine the database URL to use
effective_db_url = get_persistent_db_path() if settings.DATABASE_URL.startswith("sqlite") else settings.DATABASE_URL

# Create database engine
# For SQLite, we need to configure it differently than for PostgreSQL
if effective_db_url.startswith("sqlite"):
    # SQLite specific configuration for better compatibility
    engine = create_engine(
        effective_db_url,
        echo=False,  # Set to True for debugging SQL queries
        connect_args={
            "check_same_thread": False,  # Required for multi-threading
            "timeout": 10,  # Reduced timeout
        },
        poolclass=None  # Disable connection pooling for SQLite to avoid potential deadlocks
    )
else:
    # Configuration for PostgreSQL or other databases
    engine = create_engine(
        effective_db_url,
        pool_size=settings.DB_POOL_SIZE,
        pool_timeout=settings.DB_POOL_TIMEOUT,
        echo=False,  # Set to True for debugging SQL queries
    )


def get_session() -> Generator[Session, None, None]:
    """
    Get database session for dependency injection
    """
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()