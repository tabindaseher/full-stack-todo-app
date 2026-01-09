"""Test configuration for the Todo API backend."""

import asyncio
from typing import AsyncGenerator
from unittest.mock import patch
import pytest
from httpx import AsyncClient
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

from main import app
from database import get_session
from models import User, Todo


@pytest.fixture(name="async_client")
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """Create an async client for testing."""
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        yield ac


@pytest.fixture(name="mock_db_session")
def mock_db_session():
    """Mock database session for testing."""
    from sqlmodel import create_engine
    from sqlalchemy.pool import StaticPool

    # Create an in-memory SQLite database for testing
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    SQLModel.metadata.create_all(bind=engine)

    with patch("database.engine", engine):
        from database import get_session

        def get_test_session():
            with Session(engine) as session:
                yield session

        app.dependency_overrides[get_session] = get_test_session

        yield get_test_session

        app.dependency_overrides.clear()


@pytest.fixture(name="sample_user_data")
def sample_user_data():
    """Sample user data for testing."""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "password": "securepassword123"
    }


@pytest.fixture(name="sample_todo_data")
def sample_todo_data():
    """Sample todo data for testing."""
    return {
        "title": "Test Todo",
        "description": "Test Description",
        "priority": "medium",
        "due_date": "2023-12-31T23:59:59.000Z"
    }