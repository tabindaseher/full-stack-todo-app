# Todos API Contracts

## Get User Todos
**Endpoint**: `GET /api/todos`
**Description**: Retrieve all todos for the authenticated user
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`
- Query Parameters (optional):
  - `status`: "all", "active", "completed" (default: "all")
  - `priority`: "low", "medium", "high" (default: all)
  - `limit`: number (default: 50)
  - `offset`: number (default: 0)

**Response (Success)**:
- Status: 200 OK
```
{
  "todos": [
    {
      "id": "string",
      "title": "string",
      "description": "string (optional)",
      "completed": "boolean",
      "dueDate": "ISO date string (optional)",
      "priority": "string (low|medium|high)",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string",
      "userId": "string"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

## Create Todo
**Endpoint**: `POST /api/todos`
**Description**: Create a new todo for the authenticated user
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`
```
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional)",
  "dueDate": "ISO date string (optional)",
  "priority": "string (low|medium|high, default: medium)"
}
```

**Response (Success)**:
- Status: 201 Created
```
{
  "id": "string",
  "title": "string",
  "description": "string (optional)",
  "completed": "boolean (default: false)",
  "dueDate": "ISO date string (optional)",
  "priority": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "userId": "string"
}
```

**Response (Error)**:
- Status: 400 Bad Request (validation error)
- Status: 401 Unauthorized (invalid token)

## Get Single Todo
**Endpoint**: `GET /api/todos/{id}`
**Description**: Retrieve a specific todo by ID
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`
- Path: `id` (required, todo ID)

**Response (Success)**:
- Status: 200 OK
```
{
  "id": "string",
  "title": "string",
  "description": "string (optional)",
  "completed": "boolean",
  "dueDate": "ISO date string (optional)",
  "priority": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "userId": "string"
}
```

**Response (Error)**:
- Status: 401 Unauthorized (invalid token)
- Status: 404 Not Found (todo not found or not owned by user)

## Update Todo
**Endpoint**: `PUT /api/todos/{id}`
**Description**: Update an existing todo
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`
- Path: `id` (required, todo ID)
```
{
  "title": "string (optional, 1-200 chars)",
  "description": "string (optional)",
  "completed": "boolean (optional)",
  "dueDate": "ISO date string (optional)",
  "priority": "string (low|medium|high, optional)"
}
```

**Response (Success)**:
- Status: 200 OK
```
{
  "id": "string",
  "title": "string",
  "description": "string (optional)",
  "completed": "boolean",
  "dueDate": "ISO date string (optional)",
  "priority": "string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "userId": "string"
}
```

**Response (Error)**:
- Status: 400 Bad Request (validation error)
- Status: 401 Unauthorized (invalid token)
- Status: 404 Not Found (todo not found or not owned by user)

## Delete Todo
**Endpoint**: `DELETE /api/todos/{id}`
**Description**: Delete a todo by ID
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`
- Path: `id` (required, todo ID)

**Response (Success)**:
- Status: 200 OK
```
{
  "message": "Todo deleted successfully"
}
```

**Response (Error)**:
- Status: 401 Unauthorized (invalid token)
- Status: 404 Not Found (todo not found or not owned by user)

## Toggle Todo Completion
**Endpoint**: `PATCH /api/todos/{id}/complete`
**Description**: Toggle the completion status of a todo
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`
- Path: `id` (required, todo ID)
```
{
  "completed": "boolean (required)"
}
```

**Response (Success)**:
- Status: 200 OK
```
{
  "id": "string",
  "completed": "boolean",
  "updatedAt": "ISO date string"
}
```

**Response (Error)**:
- Status: 400 Bad Request (invalid completed value)
- Status: 401 Unauthorized (invalid token)
- Status: 404 Not Found (todo not found or not owned by user)