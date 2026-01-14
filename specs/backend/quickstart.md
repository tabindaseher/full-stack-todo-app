# Quick Start Guide for Backend Todo Application

## Prerequisites

- Python 3.8 or higher
- PostgreSQL database (Neon Serverless recommended)
- Better Auth service configured
- pip package manager

## Setup Instructions

### 1. Clone and Navigate to Project
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
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Update the `.env` file with your specific configuration:
```env
DATABASE_URL=postgresql://username:password@ep-aged-math-123456.us-east-1.aws.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
API_HOST=0.0.0.0
API_PORT=8000
LOG_LEVEL=INFO
```

### 5. Database Setup
Run database migrations:
```bash
# This will be implemented as part of the backend
```

### 6. Run the Application
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

Once running, the API will be available at `http://localhost:8000/api/v1/`

### Health Check
- `GET /health` - Verify API is running

### Task Management
- `GET /tasks` - List user's tasks
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update specific task
- `DELETE /tasks/{id}` - Delete specific task
- `PATCH /tasks/{id}/toggle` - Toggle task completion

## Authentication

All endpoints except `/health` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| BETTER_AUTH_SECRET | Secret key for JWT validation | Yes |
| BETTER_AUTH_URL | Better Auth service URL | Yes |
| API_HOST | Host address for the API | No (default: 0.0.0.0) |
| API_PORT | Port number for the API | No (default: 8000) |
| LOG_LEVEL | Logging level | No (default: INFO) |

## Testing

Run the test suite:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app
```

## Docker (Optional)

If using Docker:
```bash
docker build -t todo-backend .
docker run -p 8000:8000 todo-backend
```