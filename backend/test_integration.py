import pytest
from fastapi.testclient import TestClient
from app.main import app
import json
from datetime import datetime


def test_auth_endpoints():
    """Test the auth endpoints"""
    client = TestClient(app)
    
    # Generate unique email for this test run
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    email = f"test_{timestamp}@example.com"

    # Test registration - using JSON body
    response = client.post("/api/auth/register",
                          json={"name": "Test User", "email": email, "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert "token" in data
    assert "refreshToken" in data

    # Test login - using JSON body
    response = client.post("/api/auth/login",
                          json={"email": email, "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "user" in data
    assert "token" in data
    assert "refreshToken" in data


def test_todo_endpoints():
    """Test the todo endpoints - requires authentication"""
    client = TestClient(app)
    
    # Generate unique email for this test run
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    email = f"test_todo_{timestamp}@example.com"

    # First, register a user to get a token
    response = client.post("/api/auth/register",
                          json={"name": "Test Todo User", "email": email, "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    token = data["token"]

    # Test creating a todo with auth header - using JSON body
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/todos",
                          json={"title": "Test Todo", "description": "Test Description"},
                          headers=headers)
    assert response.status_code in [200, 201]  # POST typically returns 201, but 200 is also acceptable
    todo_data = response.json()
    assert "id" in todo_data
    assert todo_data["title"] == "Test Todo"

    # Test getting all todos
    response = client.get("/api/todos", headers=headers)
    assert response.status_code == 200
    todos = response.json()
    assert len(todos) > 0


if __name__ == "__main__":
    test_auth_endpoints()
    test_todo_endpoints()
    print("All tests passed!")