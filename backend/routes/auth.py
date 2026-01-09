from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session, select
from typing import Optional
from datetime import timedelta
from pydantic import BaseModel
from database import get_session
from models import User, UserCreate, UserRead
from utils.auth import authenticate_user, get_password_hash, create_access_token
from services.user_service import create_user as create_user_service


class LoginRequest(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.post("/login", response_model=dict)
async def login_user(login_request: LoginRequest, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token
    """
    email = login_request.email
    password = login_request.password

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    user = authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token_expires = timedelta(minutes=30)  # Use setting from config
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=access_token_expires
    )

    return {
        "success": True,
        "user": UserRead.from_orm(user) if hasattr(UserRead, 'from_orm') else user,
        "token": access_token
    }


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user
    """
    # Check if user already exists
    user_exists = session.exec(select(User).where(User.email == user_data.email)).first()
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create the user using the service
    db_user = create_user_service(session, user_data)

    # Create access token
    access_token = create_access_token(data={"sub": str(db_user.id), "email": db_user.email})

    return {
        "success": True,
        "user": UserRead.from_orm(db_user) if hasattr(UserRead, 'from_orm') else db_user,
        "token": access_token
    }