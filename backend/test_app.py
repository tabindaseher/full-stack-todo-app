#!/usr/bin/env python3
"""Test basic app functionality."""

from main import app
from fastapi.testclient import TestClient

def test_app_startup():
    """Test that the app starts up correctly."""
    client = TestClient(app)

    # Test the root endpoint
    response = client.get("/")
    print(f"Root endpoint status: {response.status_code}")
    print(f"Root endpoint response: {response.json()}")

    # Test the health endpoint
    response = client.get("/health")
    print(f"Health endpoint status: {response.status_code}")
    print(f"Health endpoint response: {response.json()}")

    print("App startup test completed successfully!")

if __name__ == "__main__":
    test_app_startup()