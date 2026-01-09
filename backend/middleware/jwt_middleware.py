from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.auth import verify_token
from typing import Optional

security = HTTPBearer()

async def jwt_required(request: Request) -> Optional[dict]:
    """
    Middleware to verify JWT token in request headers
    """
    credentials: HTTPAuthorizationCredentials = await security(request)

    if credentials:
        token = credentials.credentials
        payload = verify_token(token)

        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Add user info to request state
        request.state.user_id = payload.get("sub")
        request.state.email = payload.get("email")

        return payload
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def verify_user_owns_resource(request: Request, user_id: str):
    """
    Verify that the authenticated user owns the resource
    """
    authenticated_user_id = getattr(request.state, 'user_id', None)

    if authenticated_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this resource"
        )