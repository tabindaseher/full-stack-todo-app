from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext
from config import settings
from models import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a plain password"""
    return pwd_context.hash(password)

def hash_password(password: str) -> str:
    """Hash a plain password (alias for get_password_hash)"""
    return get_password_hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def get_current_user(token: str) -> Optional[User]:
    """Get current user from token"""
    payload = verify_token(token)
    if payload is None:
        return None

    user_id: str = payload.get("sub")
    if user_id is None:
        return None

    # In a real implementation, you would fetch the user from the database
    # For now, we return a dummy user object
    # user = get_user_by_id(user_id)
    # return user
    return User(id=user_id, email=payload.get("email", ""), name=payload.get("name", ""))

def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate user by email and password"""
    # Import inside function to avoid circular imports
    from database import get_session
    from services.user_service import get_user_by_email

    # Create a session to query the database
    # Since get_session() is a generator, we need to handle it properly
    session_gen = get_session()
    session = next(session_gen)

    try:
        # Fetch the user from the database
        user = get_user_by_email(session, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    finally:
        # Close the session
        session.close()