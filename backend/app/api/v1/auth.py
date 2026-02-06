from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session
from app.database.session import get_session
from app.auth.jwt import create_access_token
from datetime import timedelta
from typing import Dict
import logging
import uuid
import traceback
from pydantic import BaseModel
from app.models.user import User, UserCreate, UserLogin, verify_password
from sqlmodel import select

router = APIRouter()
logger = logging.getLogger(__name__)


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str  # Changed to snake_case to match frontend expectation


@router.post("/login")
async def login_user(login_data: LoginRequest, session: Session = Depends(get_session)):
    """
    Login endpoint that verifies user credentials against the database
    """
    try:
        email = login_data.email
        password = login_data.password

        logger.info(f"Attempting to login user: {email}")

        # Validate password length (bcrypt supports max 72 bytes)
        if len(password.encode('utf-8')) > 72:
            logger.warning(f"Login failed: Password too long for user {email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password cannot be longer than 72 characters"
            )

        # Query the database for the user
        statement = select(User).where(User.email == email)
        result = session.exec(statement)
        user = result.first()

        if not user:
            logger.warning(f"Login failed: User with email {email} not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Check if password is correct
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Login failed: Invalid password for user {email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        logger.info(f"Login successful for user: {email}")

        # Prepare user data to return
        user_data = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }

        # Create JWT token with user data
        token_data = {
            "sub": user.id,
            "email": user.email,
            "name": user.name,
        }

        # Create access token with 15-minute expiry
        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=15)
        )

        # Create refresh token
        refresh_token = create_access_token(
            data={**token_data, "type": "refresh"},
            expires_delta=timedelta(days=7)
        )

        return {
            "user": user_data,
            "token": access_token,
            "refreshToken": refresh_token
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        logger.error(f"HTTP Exception during login: {traceback.format_exc()}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.post("/register")
async def register_user(register_data: RegisterRequest, session: Session = Depends(get_session)):
    """
    Registration endpoint that creates a new user in the database
    """
    try:
        name = register_data.name
        email = register_data.email
        password = register_data.password

        logger.info(f"Attempting to register user: {email}")

        # Validate password length (bcrypt supports max 72 bytes)
        if len(password.encode('utf-8')) > 72:
            logger.warning(f"Registration failed: Password too long for user {email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password cannot be longer than 72 characters"
            )

        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == email)).first()
        if existing_user:
            logger.warning(f"Registration failed: User with email {email} already exists")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this email already exists"
            )

        # Create new user with hashed password
        from app.models.user import pwd_context
        hashed_password = pwd_context.hash(password)
        logger.info(f"Password hashed successfully for user: {email}")

        # Generate a unique user ID (simple approach)
        user_id = f"user_{uuid.uuid4().hex}"
        logger.info(f"Generated user ID: {user_id}")

        db_user = User(
            id=user_id,
            email=email,
            name=name,
            hashed_password=hashed_password
        )

        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        logger.info(f"User added to database: {email}")

        # Prepare user data to return
        user_data = {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name
        }

        # Create JWT token with user data
        token_data = {
            "sub": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
        }

        access_token = create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=15)
        )

        refresh_token = create_access_token(
            data={**token_data, "type": "refresh"},
            expires_delta=timedelta(days=7)
        )

        logger.info(f"Registration successful for user: {email}")

        return {
            "user": user_data,
            "token": access_token,
            "refreshToken": refresh_token
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        logger.error(f"HTTP Exception during registration: {traceback.format_exc()}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/logout")
async def logout_user():
    """
    Logout endpoint
    """
    try:
        # In a real implementation, this might invalidate tokens on the server side
        # For JWT-based stateless auth, client-side cleanup is often sufficient
        return {"message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )


@router.post("/refresh")
async def refresh_token_endpoint(refresh_data: RefreshTokenRequest):
    """
    Token refresh endpoint
    """
    try:
        refresh_token = refresh_data.refresh_token

        # In a real implementation, verify the refresh token
        # For now, we'll generate a new access token
        from app.auth.jwt import verify_token

        # Verify the refresh token
        payload = verify_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Create a new access token with user data from the refresh token
        new_token_data = {
            "sub": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
        }

        new_access_token = create_access_token(
            data=new_token_data,
            expires_delta=timedelta(minutes=15)
        )

        return {"token": new_access_token}
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error during token refresh: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )