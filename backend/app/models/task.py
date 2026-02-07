from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(index=True)  # Foreign key reference to Better Auth user ID
    due_date: Optional[datetime] = Field(default=None)
    priority: str = Field(default="medium", max_length=20)  # Add priority field


class Task(TaskBase, table=True):
    """
    Task model representing a todo item in the database
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class TaskPublic(TaskBase):
    """
    Public representation of a task without internal fields
    """
    id: int
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    """
    Model for updating a task
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = Field(default=None, max_length=20)  # Add priority field


class TaskCreate(TaskBase):
    """
    Model for creating a new task
    """
    title: str = Field(min_length=1, max_length=200)
    user_id: str