from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime
from passlib.context import CryptContext


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str


class User(UserBase, table=True):
    """
    User model representing a registered user in the database
    """
    id: Optional[str] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime, default=datetime.utcnow)
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    )


class UserPublic(UserBase):
    """
    Public representation of a user without sensitive data
    """
    id: str
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    """
    Model for creating a new user
    """
    password: str

    def hash_password(self):
        """Hash the password before storing"""
        return pwd_context.hash(self.password)


class UserLogin(SQLModel):
    """
    Model for user login credentials
    """
    email: str
    password: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash
    """
    return pwd_context.verify(plain_password, hashed_password)