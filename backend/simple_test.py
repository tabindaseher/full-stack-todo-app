#!/usr/bin/env python3
"""Simple test to verify the backend works."""

from sqlmodel import SQLModel, create_engine, Session
from models import User, Todo
from utils.auth import hash_password
import tempfile
import os

def test_basic_functionality():
    """Test basic functionality without pytest."""

    # Create an in-memory database for testing
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)

    # Test password hashing with a reasonable length password
    try:
        hashed = hash_password("testpassword123")
        print(f"✓ Password hashing works: {type(hashed)}")
    except Exception as e:
        print(f"✗ Password hashing failed: {e}")
        return False

    # Test creating a user model
    try:
        user = User(
            email="test@example.com",
            name="Test User",
            hashed_password=hash_password("testpassword123")
        )
        print(f"✓ User model creation works: {user.email}")
    except Exception as e:
        print(f"✗ User model creation failed: {e}")
        return False

    # Test creating a todo model
    try:
        # First create a user to get a valid ID
        user = User(
            email="todo@example.com",
            name="Todo User",
            hashed_password=hash_password("testpassword123")
        )

        # Create a todo
        todo = Todo(
            title="Test Todo",
            description="Test Description",
            user_id="some-user-id",  # We'll use a placeholder
            priority="medium"
        )
        print(f"✓ Todo model creation works: {todo.title}")
    except Exception as e:
        print(f"✗ Todo model creation failed: {e}")
        return False

    print("✓ All basic functionality tests passed!")
    return True

if __name__ == "__main__":
    test_basic_functionality()