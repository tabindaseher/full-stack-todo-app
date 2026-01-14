# API Endpoints Specification

## Base URL
All API endpoints are prefixed with `/api/v1/` and served from the configured backend URL.

## Authentication
All endpoints except health check require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Verify API availability
- **Auth Required**: No
- **Response**: 200 OK with status information

### Task Management

#### List Tasks
- **GET** `/tasks`
- **Description**: Retrieve all tasks belonging to the authenticated user
- **Auth Required**: Yes
- **Query Parameters**:
  - `completed`: Optional boolean to filter by completion status
  - `limit`: Optional integer to limit results
  - `offset`: Optional integer for pagination
- **Response**: 200 OK with array of task objects
- **Errors**: 401 Unauthorized if token invalid

#### Create Task
- **POST** `/tasks`
- **Description**: Create a new task for the authenticated user
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Task title (1-200 chars)",
    "description": "Optional description (max 1000 chars)",
    "completed": false,
    "due_date": "Optional ISO date string"
  }
  ```
- **Response**: 201 Created with created task object
- **Errors**: 400 Bad Request for invalid data, 401 Unauthorized if token invalid

#### Get Task
- **GET** `/tasks/{task_id}`
- **Description**: Retrieve a specific task owned by the authenticated user
- **Auth Required**: Yes
- **Path Parameter**: `task_id` - ID of the task to retrieve
- **Response**: 200 OK with task object
- **Errors**: 401 Unauthorized if token invalid, 404 Not Found if task doesn't exist or belong to user

#### Update Task
- **PUT** `/tasks/{task_id}`
- **Description**: Update a specific task owned by the authenticated user
- **Auth Required**: Yes
- **Path Parameter**: `task_id` - ID of the task to update
- **Request Body**: Same as create task
- **Response**: 200 OK with updated task object
- **Errors**: 400 Bad Request for invalid data, 401 Unauthorized if token invalid, 404 Not Found if task doesn't exist or belong to user

#### Delete Task
- **DELETE** `/tasks/{task_id}`
- **Description**: Delete a specific task owned by the authenticated user
- **Auth Required**: Yes
- **Path Parameter**: `task_id` - ID of the task to delete
- **Response**: 204 No Content
- **Errors**: 401 Unauthorized if token invalid, 404 Not Found if task doesn't exist or belong to user

#### Toggle Task Completion
- **PATCH** `/tasks/{task_id}/toggle`
- **Description**: Toggle the completion status of a specific task owned by the authenticated user
- **Auth Required**: Yes
- **Path Parameter**: `task_id` - ID of the task to toggle
- **Response**: 200 OK with updated task object
- **Errors**: 401 Unauthorized if token invalid, 404 Not Found if task doesn't exist or belong to user