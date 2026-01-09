# API Contracts: Frontend Todo Application

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

### GET /api/todos
Retrieve all todos for authenticated user

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
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "userId": "user-123",
      "dueDate": "2023-01-15T00:00:00.000Z",
      "priority": "high"
    }
  ]
}
```

### POST /api/todos
Create a new todo

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
  "dueDate": "2023-01-15T00:00:00.000Z"
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
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "userId": "user-123",
    "dueDate": "2023-01-15T00:00:00.000Z",
    "priority": "medium"
  }
}
```

### PUT /api/todos/{id}
Update an existing todo

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
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "userId": "user-123",
    "dueDate": "2023-01-15T00:00:00.000Z",
    "priority": "high"
  }
}
```

### DELETE /api/todos/{id}
Delete a todo

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

### GET /api/todos?status={status}&priority={priority}&search={query}
Filter todos with query parameters

**Headers**:
```
Authorization: Bearer <token>
```

**Parameters**:
- `status`: Optional - "active", "completed", or "all"
- `priority`: Optional - "low", "medium", "high", or "all"
- `search`: Optional - Text to search in title/description

**Response (200 OK)**:
```json
{
  "success": true,
  "todos": [
    // Array of matching todos
  ],
  "filtersApplied": {
    "status": "active",
    "priority": "high",
    "search": "important"
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
- `AUTH_003`: Insufficient permissions
- `VALIDATION_001`: Request validation failed
- `RESOURCE_001`: Resource not found
- `RESOURCE_002`: Resource conflict
- `SERVER_001`: Internal server error