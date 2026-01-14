from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[datetime] = None
    priority: str = "medium"  # Keep as required with default


class TaskCreate(TaskBase):
    title: str
    user_id: str


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None


class TaskResponse(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskToggleResponse(BaseModel):
    id: int
    completed: bool
    updated_at: datetime


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int


class ErrorResponse(BaseModel):
    detail: str
    error_code: str
    timestamp: str
    request_id: str