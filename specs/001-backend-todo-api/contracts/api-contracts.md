# API Contracts: Backend Todo API

## Authentication Endpoints

### POST /api/auth/login
Authenticate user and return JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### POST /api/auth/register
Register new user

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Todo Management Endpoints

All endpoints below require JWT token in Authorization header:
`Authorization: Bearer <token>`

### GET /api/{user_id}/tasks
Retrieve all todos for a specific user

**Path Parameters**:
- `user_id`: The ID of the user whose tasks to retrieve

**Query Parameters (Optional)**:
- `status`: Filter by completion status ('active', 'completed', or 'all')
- `priority`: Filter by priority ('low', 'medium', 'high', or 'all')
- `search`: Text to search in title/description

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "todos": [
    {
      "id": "todo-123",
      "title": "Complete project",
      "description": "Finish the todo application",
      "completed": false,
      "user_id": "user-123",
      "priority": "high",
      "due_date": "2023-01-15T00:00:00.000Z",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "filters_applied": {
    "status": "active",
    "priority": "high",
    "search": "important"
  }
}
```

### POST /api/{user_id}/tasks
Create a new todo for a user

**Path Parameters**:
- `user_id`: The ID of the user creating the task (must match authenticated user)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "due_date": "2023-01-15T00:00:00.000Z"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "todo": {
    "id": "todo-456",
    "title": "New task",
    "description": "Task description",
    "completed": false,
    "user_id": "user-123",
    "priority": "medium",
    "due_date": "2023-01-15T00:00:00.000Z",
    "created_at": "2023-01-02T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

### GET /api/{user_id}/tasks/{id}
Retrieve a specific todo for a user

**Path Parameters**:
- `user_id`: The ID of the user (must match authenticated user)
- `id`: The ID of the specific todo to retrieve

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "todo": {
    "id": "todo-123",
    "title": "Complete project",
    "description": "Finish the todo application",
    "completed": false,
    "user_id": "user-123",
    "priority": "high",
    "due_date": "2023-01-15T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/{user_id}/tasks/{id}
Update an existing todo for a user

**Path Parameters**:
- `user_id`: The ID of the user (must match authenticated user)
- `id`: The ID of the specific todo to update

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "title": "Updated task",
  "completed": true,
  "priority": "high"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "todo": {
    "id": "todo-123",
    "title": "Updated task",
    "description": "Task description",
    "completed": true,
    "user_id": "user-123",
    "priority": "high",
    "due_date": "2023-01-15T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

### DELETE /api/{user_id}/tasks/{id}
Delete a specific todo for a user

**Path Parameters**:
- `user_id`: The ID of the user (must match authenticated user)
- `id`: The ID of the specific todo to delete

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

### PATCH /api/{user_id}/tasks/{id}/complete
Toggle completion status of a specific todo

**Path Parameters**:
- `user_id`: The ID of the user (must match authenticated user)
- `id`: The ID of the specific todo to update

**Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "todo": {
    "id": "todo-123",
    "title": "Complete project",
    "description": "Finish the todo application",
    "completed": true,
    "user_id": "user-123",
    "priority": "high",
    "due_date": "2023-01-15T00:00:00.000Z",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z"
  }
}
```

## Error Responses

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorCode": "ERROR_CODE_STRING",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Common Error Codes:
- `AUTH_001`: Invalid token
- `AUTH_002`: Token expired
- `AUTH_003`: Insufficient permissions (user doesn't own resource)
- `VALIDATION_001`: Request validation failed
- `RESOURCE_001`: Resource not found
- `RESOURCE_002`: Resource conflict
- `SERVER_001`: Internal server error