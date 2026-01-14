# Authentication API Contracts

## User Registration
**Endpoint**: `POST /api/auth/register`
**Description**: Create a new user account

**Request**:
```
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "name": "string (required, 1-100 chars)"
}
```

**Response (Success)**:
- Status: 201 Created
```
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "createdAt": "ISO date string"
  },
  "token": "JWT token string",
  "refreshToken": "refresh token string"
}
```

**Response (Error)**:
- Status: 400 Bad Request (validation error)
- Status: 409 Conflict (email already exists)

## User Login
**Endpoint**: `POST /api/auth/login`
**Description**: Authenticate user and return JWT token

**Request**:
```
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (Success)**:
- Status: 200 OK
```
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "JWT token string",
  "refreshToken": "refresh token string"
}
```

**Response (Error)**:
- Status: 401 Unauthorized (invalid credentials)
- Status: 400 Bad Request (missing fields)

## User Logout
**Endpoint**: `POST /api/auth/logout`
**Description**: Invalidate user session
**Authentication**: Required (JWT token)

**Request**:
- Headers: `Authorization: Bearer <token>`

**Response**:
- Status: 200 OK
```
{
  "message": "Successfully logged out"
}
```

## Token Refresh
**Endpoint**: `POST /api/auth/refresh`
**Description**: Refresh expired access token

**Request**:
```
{
  "refreshToken": "string (required)"
}
```

**Response (Success)**:
- Status: 200 OK
```
{
  "token": "new JWT token string"
}
```

**Response (Error)**:
- Status: 401 Unauthorized (invalid refresh token)