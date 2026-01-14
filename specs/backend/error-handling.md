# Error Handling Specification

## Error Response Format
All API errors return JSON responses with the following structure:
```json
{
  "detail": "Human-readable error message",
  "error_code": "Machine-readable error code",
  "timestamp": "ISO 8601 formatted timestamp",
  "request_id": "Unique identifier for the request"
}
```

## HTTP Status Codes

### Authentication & Authorization Errors
- **401 Unauthorized**: Invalid, expired, or missing JWT token
  - Error Code: `INVALID_CREDENTIALS`
  - Detail Message: "Invalid or expired authentication token"
- **403 Forbidden**: User lacks permission for requested resource
  - Error Code: `INSUFFICIENT_PERMISSIONS`
  - Detail Message: "Insufficient permissions to access this resource"

### Client-Side Errors
- **400 Bad Request**: Invalid request payload or parameters
  - Error Code: `INVALID_REQUEST`
  - Detail Message: Specific validation error details
- **404 Not Found**: Requested resource doesn't exist
  - Error Code: `RESOURCE_NOT_FOUND`
  - Detail Message: "Requested resource does not exist"
- **409 Conflict**: Request conflicts with current state
  - Error Code: `CONFLICT_DETECTED`
  - Detail Message: Details about the conflict

### Server-Side Errors
- **500 Internal Server Error**: Unhandled server exception
  - Error Code: `INTERNAL_ERROR`
  - Detail Message: Generic message without sensitive details
- **503 Service Unavailable**: Dependency failure (e.g., database)
  - Error Code: `SERVICE_UNAVAILABLE`
  - Detail Message: "Service temporarily unavailable"

## Error Categories

### Validation Errors
- **Cause**: Invalid input data (format, range, required fields)
- **Handling**: Return 400 Bad Request with specific validation details
- **Logging**: Log at INFO level with sanitized input
- **User Message**: Clear indication of what validation failed

### Authentication Errors
- **Cause**: Invalid JWT token, expired token, or missing authentication
- **Handling**: Return 401 Unauthorized consistently
- **Logging**: Log at WARN level with request details (no token content)
- **User Message**: Direct but informative about authentication requirement

### Authorization Errors
- **Cause**: User attempting to access resources they don't own
- **Handling**: Return 404 Not Found (not 403) to avoid information disclosure
- **Logging**: Log at WARN level with user ID and attempted access
- **User Message**: Resource not found (not access denied)

### Database Errors
- **Cause**: Connection failures, constraint violations, query timeouts
- **Handling**: Return 500 Internal Server Error or 503 Service Unavailable
- **Logging**: Log at ERROR level with full error details
- **User Message**: Generic service unavailable message

## Exception Hierarchy
- **Business Logic Exceptions**: Custom exceptions for domain-specific errors
- **Validation Exceptions**: For input validation failures
- **Authentication Exceptions**: For auth-related failures
- **Authorization Exceptions**: For permission-related failures
- **Infrastructure Exceptions**: For database, network, or system failures

## Logging Strategy
- **Log Levels**: Use appropriate levels (DEBUG, INFO, WARN, ERROR)
- **Sensitive Data**: Never log JWT tokens, passwords, or other secrets
- **PII Protection**: Apply appropriate masking for personal information
- **Request Tracking**: Include request ID for tracing across services
- **Structured Logging**: Use consistent format with relevant context

## Recovery Mechanisms
- **Idempotent Operations**: Design safe retries for certain operations
- **Fallback Behavior**: Implement graceful degradation where possible
- **Circuit Breakers**: For external service dependencies
- **Retry Logic**: For transient failures with exponential backoff

## Monitoring Integration
- **Error Metrics**: Track error rates by type and endpoint
- **Alerting**: Set up alerts for unusual error patterns
- **Correlation**: Link related errors for troubleshooting
- **Trends**: Monitor error trends over time for capacity planning