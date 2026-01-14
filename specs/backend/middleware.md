# Middleware Specification

## JWT Validation Middleware
- **Purpose**: Validate JWT tokens on all protected endpoints
- **Execution Order**: Runs before route handlers for protected endpoints
- **Functionality**:
  - Extracts Authorization header from incoming requests
  - Verifies JWT token signature using BETTER_AUTH_SECRET
  - Validates token expiration and integrity
  - Extracts user identity from token claims
  - Attaches user information to request context
  - Returns 401 Unauthorized for invalid tokens

## Error Handling Middleware
- **Purpose**: Handle uncaught exceptions and provide consistent error responses
- **Execution Order**: Runs as the last middleware in the chain
- **Functionality**:
  - Catches unhandled exceptions in route handlers
  - Logs error details for debugging and monitoring
  - Returns standardized JSON error responses
  - Maps internal errors to appropriate HTTP status codes
  - Prevents sensitive information leakage in error messages

## Request Logging Middleware
- **Purpose**: Log incoming requests for monitoring and debugging
- **Execution Order**: Runs early in the middleware chain
- **Functionality**:
  - Logs request method, path, and basic headers
  - Records response status and timing information
  - Tracks user ID for authenticated requests (when available)
  - Logs request processing duration
  - Excludes sensitive data like authorization tokens from logs

## CORS Middleware (Optional)
- **Purpose**: Configure Cross-Origin Resource Sharing for frontend integration
- **Configuration**:
  - Allow origins from NEXT_PUBLIC_API_BASE_URL environment variable
  - Allow standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
  - Allow credentials for authenticated requests
  - Allow standard headers including Authorization
  - Expose custom headers as needed for frontend integration

## Rate Limiting Middleware (Recommended)
- **Purpose**: Prevent abuse and protect against DoS attacks
- **Implementation**: Optional but recommended for production
- **Configuration**:
  - Limit requests per IP address
  - Different limits for authenticated vs anonymous endpoints
  - Configurable limits via environment variables
  - Return 429 Too Many Requests when exceeded
  - Track usage for monitoring purposes

## Middleware Chain Order
1. CORS Middleware (if enabled)
2. Request Logging Middleware
3. JWT Validation Middleware (for protected endpoints)
4. Route Handler
5. Error Handling Middleware

## Performance Considerations
- **Efficiency**: Minimize processing overhead in middleware
- **Caching**: Cache validated JWT results where appropriate
- **Async Processing**: Use non-blocking operations where possible
- **Resource Management**: Properly clean up resources after each request

## Security Considerations
- **Information Disclosure**: Do not log sensitive data like tokens or passwords
- **Input Sanitization**: Validate and sanitize inputs at middleware level
- **Timing Attacks**: Implement constant-time comparisons where applicable
- **Header Security**: Validate and sanitize HTTP headers appropriately