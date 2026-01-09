# Quickstart: Backend Todo API

## Prerequisites

- Python 3.11+
- pip package manager
- Git for version control
- PostgreSQL database (or Neon Serverless PostgreSQL connection string)

## Setup Instructions

### 1. Clone and Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your database connection and secret keys
nano .env
```

### 5. Environment Variables
The following environment variables need to be configured:

```bash
APP_NAME=Todo Backend API
API_VERSION=1.0.0
DEBUG=True
DATABASE_URL=postgresql://username:password@localhost/dbname
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 6. Database Setup
```bash
# Run database migrations (if using Alembic)
alembic upgrade head

# Or create tables directly (if using SQLModel's create_db_and_tables)
python -c "from database import create_db_and_tables; create_db_and_tables()"
```

### 7. Run Development Server
```bash
# Method 1: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Method 2: Using the startup script
./start.sh  # On Windows: start.bat

# Method 3: Running the app module
python -m app
```

The API will be available at `http://localhost:8000`

## API Endpoints Overview

### Authentication
- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/register` - Register a new user

### Todo Operations
- `GET /api/{user_id}/tasks` - List all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get task details
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion status

## Testing the API

### With curl (example)
```bash
# Register a new user
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "Test User", "password": "securepassword"}'

# Login to get JWT token
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

### With Python requests (example)
```python
import requests

# Login to get token
response = requests.post("http://localhost:8000/api/auth/login", json={
    "email": "user@example.com",
    "password": "securepassword"
})
token = response.json()["token"]

# Use token to access protected endpoints
headers = {"Authorization": f"Bearer {token}"}
response = requests.get("http://localhost:8000/api/user-id-here/tasks", headers=headers)
```

## Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=backend

# Run specific test file
pytest tests/test_tasks.py
```

## Development Commands

```bash
# Format code with black
black .

# Lint code with flake8
flake8 .

# Run type checking with mypy
mypy backend/
```

## Production Deployment

For production deployment, consider:
- Setting `DEBUG=False`
- Using a production-grade database
- Setting up a reverse proxy (nginx)
- Using a process manager (gunicorn) instead of uvicorn's dev server
- Implementing proper logging
- Setting up monitoring and alerting