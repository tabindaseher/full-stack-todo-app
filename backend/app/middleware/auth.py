from fastapi import HTTPException, status
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import verify_token
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp, Receive, Scope, Send


class JWTBearer(HTTPBearer):
    """
    JWT Bearer token authentication scheme
    """
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )
            token = credentials.credentials
            payload = verify_token(token)
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid token or expired token."
                )
            return user_id  # Return the user_id instead of the token
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code."
            )


# Middleware to validate JWT tokens
async def jwt_auth_middleware(request: Request, call_next):
    # Skip authentication for health check and other public endpoints
    if request.url.path == "/health" or request.url.path.startswith("/docs") or request.url.path.startswith("/redoc"):
        response = await call_next(request)
        return response

    # For protected endpoints, check for Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    token = auth_header.split(" ")[1]
    try:
        # Verify the token
        verify_token(token)
        response = await call_next(request)
        return response
    except HTTPException:
        # Re-raise HTTP exceptions (like invalid token)
        raise
    except Exception:
        # For other exceptions during token verification
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )