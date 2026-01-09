"""Tests for the database models."""

import pytest
from sqlmodel import Session
from models import User, Todo
from utils.auth import hash_password


def test_user_model_creation(mock_db_session):
    """Test creating a user model."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        hashed_pw = hash_password("securepassword123")

        user = User(
            email="test@example.com",
            name="Test User",
            hashed_password=hashed_pw
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.hashed_password == hashed_pw
        assert user.is_active is True
        assert user.id is not None
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


def test_todo_model_creation(mock_db_session):
    """Test creating a todo model."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # First create a user
        hashed_pw = hash_password("securepassword123")
        user = User(
            email="test@example.com",
            name="Test User",
            hashed_password=hashed_pw
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # Create a todo associated with the user
        todo = Todo(
            title="Test Todo",
            description="Test Description",
            user_id=user.id,
            priority="medium"
        )

        session.add(todo)
        session.commit()
        session.refresh(todo)

        assert todo.title == "Test Todo"
        assert todo.description == "Test Description"
        assert todo.user_id == user.id
        assert todo.priority == "medium"
        assert todo.completed is False
        assert todo.id is not None
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


def test_user_todos_relationship(mock_db_session):
    """Test the relationship between users and todos."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Create a user
        hashed_pw = hash_password("securepassword123")
        user = User(
            email="test@example.com",
            name="Test User",
            hashed_password=hashed_pw
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # Create multiple todos for the user
        todo1 = Todo(
            title="Test Todo 1",
            user_id=user.id,
            priority="medium"
        )
        todo2 = Todo(
            title="Test Todo 2",
            user_id=user.id,
            priority="high"
        )

        session.add(todo1)
        session.add(todo2)
        session.commit()

        # Refresh the user to get the todos
        session.refresh(user)

        # Verify the relationship by querying
        from sqlalchemy import select
        stmt = select(Todo).where(Todo.user_id == user.id)
        user_todos = session.exec(stmt).all()

        assert len(user_todos) >= 2  # At least these 2 todos
        titles = [todo.title for todo in user_todos]
        assert "Test Todo 1" in titles
        assert "Test Todo 2" in titles
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


def test_todo_validation():
    """Test validation rules for the Todo model."""
    # Test that title is required (minimum length is 1)
    with pytest.raises(ValueError):
        Todo(title="", user_id="some-user-id", priority="medium")

    # Test that title length is validated
    long_title = "x" * 256  # Too long
    with pytest.raises(ValueError):
        Todo(title=long_title, user_id="some-user-id", priority="medium")

    # Test that priority is validated
    with pytest.raises(ValueError):
        Todo(title="Valid Title", user_id="some-user-id", priority="invalid")