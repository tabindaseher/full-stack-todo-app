import pytest
from fastapi.testclient import TestClient
from app.main import app


def test_health_check():
    """Test the health check endpoint"""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"


def test_docs_available():
    """Test that documentation endpoints are available"""
    client = TestClient(app)
    response = client.get("/docs")
    assert response.status_code == 200


def test_redoc_available():
    """Test that redoc documentation is available"""
    client = TestClient(app)
    response = client.get("/redoc")
    assert response.status_code == 200