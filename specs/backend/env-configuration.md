# Environment Configuration Specification

## Required Environment Variables

### Database Configuration
- **Variable**: `DATABASE_URL`
- **Description**: PostgreSQL connection string for Neon Serverless
- **Format**: `postgresql://username:password@host:port/database_name`
- **Required**: Yes
- **Default**: None
- **Example**: `postgresql://user:pass@ep-aged-math-123456.us-east-1.aws.neon.tech/mydb`

### Authentication Configuration
- **Variable**: `BETTER_AUTH_SECRET`
- **Description**: Secret key for JWT signing and verification
- **Required**: Yes
- **Default**: None
- **Security**: Must be strong, randomly generated secret
- **Example**: `etVzjBbNXFrnSMzd3l2mxc0dHPvg8sbN`

- **Variable**: `BETTER_AUTH_URL`
- **Description**: URL of the Better Auth service
- **Required**: Yes
- **Default**: None
- **Format**: Full URL with protocol
- **Example**: `http://localhost:3000` or `https://myapp.com`

## Optional Environment Variables

### API Configuration
- **Variable**: `API_HOST`
- **Description**: Host address for the API server
- **Required**: No
- **Default**: `0.0.0.0`
- **Example**: `0.0.0.0`

- **Variable**: `API_PORT`
- **Description**: Port number for the API server
- **Required**: No
- **Default**: `8000`
- **Example**: `8000`

### CORS Configuration
- **Variable**: `ALLOWED_ORIGINS`
- **Description**: Comma-separated list of allowed origins
- **Required**: No
- **Default**: `*` (allow all in development)
- **Example**: `http://localhost:3000,https://myapp.com`

### Logging Configuration
- **Variable**: `LOG_LEVEL`
- **Description**: Minimum log level to output
- **Required**: No
- **Default**: `INFO`
- **Options**: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`
- **Example**: `INFO`

### Database Pool Configuration
- **Variable**: `DB_POOL_SIZE`
- **Description**: Size of the database connection pool
- **Required**: No
- **Default**: `20`
- **Example**: `20`

- **Variable**: `DB_POOL_TIMEOUT`
- **Description**: Timeout for acquiring database connections
- **Required**: No
- **Default**: `30`
- **Example**: `30` (seconds)

## Configuration Loading Strategy
1. **Environment Priority**: Environment variables override all other configurations
2. **Validation**: All required variables must be present at startup
3. **Startup Check**: Application fails to start if required variables are missing
4. **Secure Loading**: Secrets should be loaded from secure sources in production

## Configuration Validation
- **Required Check**: Verify all required variables are present
- **Format Validation**: Validate URL formats, numeric ranges, etc.
- **Connectivity Test**: Test database connection at startup
- **JWT Secret Check**: Verify JWT secret meets minimum length requirements

## Security Considerations
- **Secret Management**: Never hardcode secrets in source code
- **Environment Isolation**: Different environments use different secrets
- **Access Control**: Restrict access to environment variables containing secrets
- **Auditing**: Log configuration loading (without revealing secret values)
- **Rotation**: Support for easy rotation of secrets without application restart

## Environment-Specific Configurations

### Development
- `LOG_LEVEL=DEBUG`
- `ALLOWED_ORIGINS=*` (or specific local URLs)
- Less restrictive validation for easier development

### Staging
- Production-like settings with monitoring enabled
- Similar to production but with additional debugging capabilities

### Production
- Strictest security settings
- Specific allowed origins only
- Appropriate log levels for production monitoring
- Optimized database pool sizes for expected load