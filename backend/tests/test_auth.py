"""Tests for authentication endpoints."""

import pytest
from httpx import AsyncClient
from utils.auth import verify_password, hash_password
from models import User


@pytest.mark.asyncio
async def test_register_endpoint(async_client, mock_db_session):
    """Test user registration endpoint."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Test registration with valid data
        response = await async_client.post("/api/auth/register", json={
            "email": "newuser@example.com",
            "name": "New User",
            "password": "securepassword123"
        })

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert "user" in data
        assert "token" in data
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["name"] == "New User"
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_register_duplicate_email(async_client, mock_db_session):
    """Test registration with duplicate email."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register a user first
        await async_client.post("/api/auth/register", json={
            "email": "duplicate@example.com",
            "name": "Duplicate User",
            "password": "securepassword123"
        })

        # Try to register with the same email
        response = await async_client.post("/api/auth/register", json={
            "email": "duplicate@example.com",
            "name": "Another User",
            "password": "anotherpassword123"
        })

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "already exists" in data["message"].lower()
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_login_valid_credentials(async_client, mock_db_session):
    """Test login with valid credentials."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # First register a user
        register_response = await async_client.post("/api/auth/register", json={
            "email": "loginuser@example.com",
            "name": "Login User",
            "password": "securepassword123"
        })

        assert register_response.status_code == 201

        # Now try to login with valid credentials
        response = await async_client.post("/api/auth/login", json={
            "email": "loginuser@example.com",
            "password": "securepassword123"
        })

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "user" in data
        assert "token" in data
        assert data["user"]["email"] == "loginuser@example.com"
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_login_invalid_credentials(async_client, mock_db_session):
    """Test login with invalid credentials."""
    # Get a session from the fixture
    session_gen = mock_db_session()
    session = next(session_gen)

    try:
        # Register a user first
        await async_client.post("/api/auth/register", json={
            "email": "wronglogin@example.com",
            "name": "Wrong Login User",
            "password": "correctpassword123"
        })

        # Try to login with wrong password
        response = await async_client.post("/api/auth/login", json={
            "email": "wronglogin@example.com",
            "password": "wrongpassword123"
        })

        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False
        assert "invalid credentials" in data["message"].lower()

        # Try to login with non-existent email
        response = await async_client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "any_password"
        })

        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False
        assert "invalid credentials" in data["message"].lower()
    finally:
        # Close the session generator
        try:
            next(session_gen)
        except StopIteration:
            pass


@pytest.mark.asyncio
async def test_password_hashing():
    """Test password hashing and verification."""
    plain_password = "my_secure_password"
    hashed = hash_password(plain_password)

    # Verify the password matches
    assert verify_password(plain_password, hashed) is True

    # Verify wrong password doesn't match
    assert verify_password("wrong_password", hashed) is False