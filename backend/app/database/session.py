from sqlmodel import create_engine, Session
from app.core.config import settings
from typing import Generator


# Create database engine
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