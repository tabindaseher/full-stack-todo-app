"""Tests for task endpoints with user isolation."""

import pytest
from httpx import AsyncClient
from datetime import datetime
from models import User, Todo
from utils.auth import hash_password, create_access_token


@pytest.mark.asyncio
async def test_create_task_authenticated(async_client, mock_db_session):
    """Test creating a task with authenticated user."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register and login to get a token
        register_response = await async_client.post("/api/auth/register", json={
            "email": "taskuser@example.com",
            "name": "Task User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201
        register_data = register_response.json()
        token = register_data["token"]
        user_id = register_data["user"]["id"]

        # Create a task
        response = await async_client.post(
            f"/api/{user_id}/tasks",
            json={
                "title": "Test Task",
                "description": "Test Description",
                "priority": "medium",
                "due_date": "2023-12-31T23:59:59.000Z"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert "todo" in data
        assert data["todo"]["title"] == "Test Task"
        assert data["todo"]["user_id"] == user_id
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_get_user_tasks(async_client, mock_db_session):
    """Test retrieving tasks for authenticated user."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register and login to get a token
        register_response = await async_client.post("/api/auth/register", json={
            "email": "gettaskuser@example.com",
            "name": "Get Task User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201
        register_data = register_response.json()
        token = register_data["token"]
        user_id = register_data["user"]["id"]

        # Create a task first
        create_response = await async_client.post(
            f"/api/{user_id}/tasks",
            json={
                "title": "Get Test Task",
                "description": "Get Test Description",
                "priority": "high"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert create_response.status_code == 201
        task_id = create_response.json()["todo"]["id"]

        # Retrieve the task
        response = await async_client.get(
            f"/api/{user_id}/tasks",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "todos" in data
        assert len(data["todos"]) >= 1

        # Find our specific task
        task_found = False
        for todo in data["todos"]:
            if todo["id"] == task_id:
                assert todo["title"] == "Get Test Task"
                assert todo["user_id"] == user_id
                task_found = True
                break
        assert task_found is True
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_update_task_authenticated(async_client, mock_db_session):
    """Test updating a task with authenticated user."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register and login to get a token
        register_response = await async_client.post("/api/auth/register", json={
            "email": "updatetaskuser@example.com",
            "name": "Update Task User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201
        register_data = register_response.json()
        token = register_data["token"]
        user_id = register_data["user"]["id"]

        # Create a task first
        create_response = await async_client.post(
            f"/api/{user_id}/tasks",
            json={
                "title": "Original Task",
                "description": "Original Description",
                "priority": "low"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert create_response.status_code == 201
        task_data = create_response.json()
        task_id = task_data["todo"]["id"]
        assert task_data["todo"]["title"] == "Original Task"

        # Update the task
        response = await async_client.put(
            f"/api/{user_id}/tasks/{task_id}",
            json={
                "title": "Updated Task",
                "description": "Updated Description",
                "priority": "high",
                "completed": True
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "todo" in data
        assert data["todo"]["title"] == "Updated Task"
        assert data["todo"]["description"] == "Updated Description"
        assert data["todo"]["priority"] == "high"
        assert data["todo"]["completed"] is True
        assert data["todo"]["id"] == task_id
        assert data["todo"]["user_id"] == user_id
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_delete_task_authenticated(async_client, mock_db_session):
    """Test deleting a task with authenticated user."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register and login to get a token
        register_response = await async_client.post("/api/auth/register", json={
            "email": "deletetaskuser@example.com",
            "name": "Delete Task User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201
        register_data = register_response.json()
        token = register_data["token"]
        user_id = register_data["user"]["id"]

        # Create a task first
        create_response = await async_client.post(
            f"/api/{user_id}/tasks",
            json={
                "title": "Task to Delete",
                "description": "Description to Delete",
                "priority": "medium"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert create_response.status_code == 201
        task_data = create_response.json()
        task_id = task_data["todo"]["id"]

        # Delete the task
        response = await async_client.delete(
            f"/api/{user_id}/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "message" in data
        assert "deleted successfully" in data["message"].lower()

        # Verify the task is gone by trying to get it
        get_response = await async_client.get(
            f"/api/{user_id}/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert get_response.status_code == 404
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_toggle_task_completion(async_client, mock_db_session):
    """Test toggling task completion status."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register and login to get a token
        register_response = await async_client.post("/api/auth/register", json={
            "email": "toggletaskuser@example.com",
            "name": "Toggle Task User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201
        register_data = register_response.json()
        token = register_data["token"]
        user_id = register_data["user"]["id"]

        # Create a task first (initially not completed)
        create_response = await async_client.post(
            f"/api/{user_id}/tasks",
            json={
                "title": "Toggle Completion Task",
                "description": "Description for completion toggle",
                "priority": "medium"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert create_response.status_code == 201
        task_data = create_response.json()
        task_id = task_data["todo"]["id"]
        assert task_data["todo"]["completed"] is False

        # Toggle completion (should become completed)
        response = await async_client.patch(
            f"/api/{user_id}/tasks/{task_id}/complete",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "todo" in data
        assert data["todo"]["id"] == task_id
        assert data["todo"]["completed"] is True  # Should now be completed

        # Toggle again (should become not completed)
        response = await async_client.patch(
            f"/api/{user_id}/tasks/{task_id}/complete",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "todo" in data
        assert data["todo"]["id"] == task_id
        assert data["todo"]["completed"] is False  # Should now be not completed
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_user_isolation_get_tasks(async_client, mock_db_session):
    """Test that users can only access their own tasks (GET)."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register first user
        user1_response = await async_client.post("/api/auth/register", json={
            "email": "user1@example.com",
            "name": "User 1",
            "password": "securepassword123"
        })
        assert user1_response.status_code == 201
        user1_data = user1_response.json()
        user1_token = user1_data["token"]
        user1_id = user1_data["user"]["id"]

        # Register second user
        user2_response = await async_client.post("/api/auth/register", json={
            "email": "user2@example.com",
            "name": "User 2",
            "password": "securepassword123"
        })
        assert user2_response.status_code == 201
        user2_data = user2_response.json()
        user2_token = user2_data["token"]
        user2_id = user2_data["user"]["id"]

        # User 1 creates a task
        create_response = await async_client.post(
            f"/api/{user1_id}/tasks",
            json={
                "title": "User 1's Private Task",
                "description": "This belongs to user 1",
                "priority": "high"
            },
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert create_response.status_code == 201
        task_data = create_response.json()
        task_id = task_data["todo"]["id"]

        # User 2 tries to access User 1's task directly
        response = await async_client.get(
            f"/api/{user1_id}/tasks/{task_id}",  # Trying to access user1's task
            headers={"Authorization": f"Bearer {user2_token}"}  # But with user2's token
        )

        # Should fail with 403 Forbidden due to user mismatch
        assert response.status_code == 403
        data = response.json()
        assert data["success"] is False
        assert "permissions" in data["message"].lower()

        # User 2 tries to access User 1's tasks list
        response = await async_client.get(
            f"/api/{user1_id}/tasks",  # Trying to access user1's tasks
            headers={"Authorization": f"Bearer {user2_token}"}  # But with user2's token
        )

        # Should fail with 403 Forbidden due to user mismatch
        assert response.status_code == 403
        data = response.json()
        assert data["success"] is False
        assert "permissions" in data["message"].lower()
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_user_isolation_modify_tasks(async_client, mock_db_session):
    """Test that users can only modify their own tasks."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register first user
        user1_response = await async_client.post("/api/auth/register", json={
            "email": "modifyuser1@example.com",
            "name": "Modify User 1",
            "password": "securepassword123"
        })
        assert user1_response.status_code == 201
        user1_data = user1_response.json()
        user1_token = user1_data["token"]
        user1_id = user1_data["user"]["id"]

        # Register second user
        user2_response = await async_client.post("/api/auth/register", json={
            "email": "modifyuser2@example.com",
            "name": "Modify User 2",
            "password": "securepassword123"
        })
        assert user2_response.status_code == 201
        user2_data = user2_response.json()
        user2_token = user2_data["token"]
        user2_id = user2_data["user"]["id"]

        # User 1 creates a task
        create_response = await async_client.post(
            f"/api/{user1_id}/tasks",
            json={
                "title": "User 1's Protected Task",
                "description": "This belongs to user 1",
                "priority": "high"
            },
            headers={"Authorization": f"Bearer {user1_token}"}
        )
        assert create_response.status_code == 201
        task_data = create_response.json()
        task_id = task_data["todo"]["id"]

        # User 2 tries to update User 1's task
        response = await async_client.put(
            f"/api/{user1_id}/tasks/{task_id}",  # Trying to update user1's task
            json={"title": "Hacked by User 2"},
            headers={"Authorization": f"Bearer {user2_token}"}  # But with user2's token
        )

        # Should fail with 403 Forbidden due to user mismatch
        assert response.status_code == 403
        data = response.json()
        assert data["success"] is False
        assert "permissions" in data["message"].lower()

        # User 2 tries to delete User 1's task
        response = await async_client.delete(
            f"/api/{user1_id}/tasks/{task_id}",  # Trying to delete user1's task
            headers={"Authorization": f"Bearer {user2_token}"}  # But with user2's token
        )

        # Should fail with 403 Forbidden due to user mismatch
        assert response.status_code == 403
        data = response.json()
        assert data["success"] is False
        assert "permissions" in data["message"].lower()

        # User 2 tries to toggle completion of User 1's task
        response = await async_client.patch(
            f"/api/{user1_id}/tasks/{task_id}/complete",  # Trying to toggle user1's task
            headers={"Authorization": f"Bearer {user2_token}"}  # But with user2's token
        )

        # Should fail with 403 Forbidden due to user mismatch
        assert response.status_code == 403
        data = response.json()
        assert data["success"] is False
        assert "permissions" in data["message"].lower()
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_unauthorized_access(async_client):
    """Test that unauthorized requests are rejected."""
    # Try to create a task without authentication
    response = await async_client.post(
        "/api/some-user-id/tasks",
        json={
            "title": "Unauthorized Task",
            "description": "Should not be created",
            "priority": "medium"
        }
    )

    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "authorization" in data["message"].lower()

    # Try to get tasks without authentication
    response = await async_client.get("/api/some-user-id/tasks")

    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "authorization" in data["message"].lower()


@pytest.mark.asyncio
async def test_get_specific_task(async_client, mock_db_session):
    """Test getting a specific task by ID."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register and login to get a token
        register_response = await async_client.post("/api/auth/register", json={
            "email": "specificuser@example.com",
            "name": "Specific User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201
        register_data = register_response.json()
        token = register_data["token"]
        user_id = register_data["user"]["id"]

        # Create a task first
        create_response = await async_client.post(
            f"/api/{user_id}/tasks",
            json={
                "title": "Specific Task",
                "description": "Specific Description",
                "priority": "high"
            },
            headers={"Authorization": f"Bearer {token}"}
        )

        assert create_response.status_code == 201
        task_data = create_response.json()
        task_id = task_data["todo"]["id"]

        # Get the specific task
        response = await async_client.get(
            f"/api/{user_id}/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "todo" in data
        assert data["todo"]["id"] == task_id
        assert data["todo"]["title"] == "Specific Task"
        assert data["todo"]["user_id"] == user_id
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass