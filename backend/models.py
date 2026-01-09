from sqlmodel import SQLModel, Field, Relationship, Column, DateTime
from typing import Optional
from datetime import datetime
import uuid
from enum import Enum
from sqlalchemy import ForeignKey

def get_current_time():
    return datetime.now()

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class UserBase(SQLModel):
    email: str = Field(unique=True, nullable=False)
    name: str = Field(max_length=100)

class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=get_current_time, sa_column=Column(DateTime))
    updated_at: datetime = Field(default_factory=get_current_time, sa_column=Column(DateTime))
    is_active: bool = Field(default=True)

    # Relationship to todos
    todos: list["Todo"] = Relationship(back_populates="user")

class TodoBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(sa_column=Column(ForeignKey("users.id"), nullable=False))
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    due_date: Optional[datetime] = Field(default=None, sa_column=Column(DateTime))

class Todo(TodoBase, table=True):
    __tablename__ = "todos"

    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=get_current_time, sa_column=Column(DateTime))
    updated_at: datetime = Field(default_factory=get_current_time, sa_column=Column(DateTime))

    # Relationship to user
    user: Optional[User] = Relationship(back_populates="todos")

class TodoCreate(TodoBase):
    pass

class TodoRead(TodoBase):
    id: str
    created_at: datetime
    updated_at: datetime

class TodoUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)
    priority: Optional[PriorityEnum] = Field(default=None)
    due_date: Optional[datetime] = Field(default=None)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    is_active: bool