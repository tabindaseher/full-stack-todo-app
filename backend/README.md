# Todo Backend API

This is the backend for the Todo application, built with FastAPI, SQLModel, and PostgreSQL.

## Features

- **REST API endpoints** for Todo CRUD operations
- **JWT-based authentication and authorization**
- **User isolation** - each user can only access their own tasks
- **SQLModel ORM** for database operations
- **Neon Serverless PostgreSQL** for persistent storage
- **Error handling** with proper HTTP status codes
- **JWT middleware** for route protection

## API Endpoints

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

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   export DATABASE_URL=postgresql://username:password@localhost/dbname
   export JWT_SECRET_KEY=your-super-secret-key
   ```

3. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

## Environment Variables

- `DATABASE_URL`: Database connection string
- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `JWT_ALGORITHM`: Algorithm for JWT (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration time (default: 30)
- `APP_NAME`: Application name (default: Todo Backend API)
- `API_VERSION`: API version (default: 1.0.0)
- `DEBUG`: Enable debug mode (default: False)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (default: http://localhost:3000,http://localhost:3001)

## Database Models

### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String
- `hashed_password`: String
- `created_at`: DateTime
- `updated_at`: DateTime
- `is_active`: Boolean

### Todo
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String (Optional)
- `completed`: Boolean
- `user_id`: UUID (Foreign Key to User)
- `priority`: String (low, medium, high)
- `due_date`: DateTime (Optional)
- `created_at`: DateTime
- `updated_at`: DateTime

## Security

- All endpoints except authentication require a valid JWT token
- Users can only access their own tasks
- Passwords are hashed using bcrypt
- CORS is configured to allow specific origins