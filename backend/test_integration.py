import pytest
from fastapi.testclient import TestClient
from app.main import app
import json


def test_auth_endpoints():
    """Test the auth endpoints"""
    client = TestClient(app)

    # Test registration - using JSON body
    response = client.post("/api/v1/auth/register",
                          json={"name": "Test User", "email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert "token" in data
    assert "refreshToken" in data

    # Test login - using JSON body
    response = client.post("/api/v1/auth/login",
                          json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert "token" in data
    assert "refreshToken" in data


def test_todo_endpoints():
    """Test the todo endpoints - requires authentication"""
    client = TestClient(app)

    # First, register a user to get a token
    response = client.post("/api/v1/auth/register",
                          json={"name": "Test User", "email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    token = data["token"]

    # Test creating a todo with auth header - using JSON body
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/v1/todos",
                          json={"title": "Test Todo", "description": "Test Description"},
                          headers=headers)
    assert response.status_code == 200
    todo_data = response.json()
    assert "id" in todo_data
    assert todo_data["title"] == "Test Todo"

    # Test getting all todos
    response = client.get("/api/v1/todos", headers=headers)
    assert response.status_code == 200
    todos = response.json()
    assert len(todos) > 0


if __name__ == "__main__":
    test_auth_endpoints()
    test_todo_endpoints()
    print("All tests passed!")