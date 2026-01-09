from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from database import get_session
from models import Todo, TodoCreate, TodoRead, TodoUpdate, User
from middleware.jwt_middleware import jwt_required, verify_user_owns_resource
from services.todo_service import (
    create_todo as create_todo_service,
    get_todo_by_id as get_todo_by_id_service,
    update_todo as update_todo_service,
    delete_todo as delete_todo_service,
    get_todos as get_todos_service,
    toggle_todo_completion as toggle_todo_completion_service
)

router = APIRouter()


@router.get("/tasks", response_model=List[TodoRead])
async def list_tasks(
    user_id: str = Path(..., description="The ID of the user"),
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """
    Get all tasks for a specific user with optional filtering
    """
    # Verify user owns the resource
    # In a real implementation, this would be done via middleware

    todos = get_todos_service(
        session=session,
        user_id=user_id,
        status=status,
        priority=priority,
        search=search
    )
    return todos


@router.post("/tasks", response_model=TodoRead)
async def create_task(
    user_id: str = Path(..., description="The ID of the user"),
    todo_data: TodoCreate = None,
    session: Session = Depends(get_session)
):
    """
    Create a new task for a specific user
    """
    # Verify user owns the resource
    # In a real implementation, this would be done via middleware

    # Set the user_id from the path parameter
    todo_data_dict = todo_data.dict()
    todo_data_dict["user_id"] = user_id

    # Create a new Todo instance
    todo = Todo(**todo_data_dict)

    created_todo = create_todo_service(session=session, todo=todo)
    return created_todo


@router.get("/tasks/{id}", response_model=TodoRead)
async def get_task(
    user_id: str = Path(..., description="The ID of the user"),
    id: str = Path(..., description="The ID of the task"),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for a specific user
    """
    # Verify user owns the resource
    # In a real implementation, this would be done via middleware

    todo = get_todo_by_id_service(session=session, todo_id=id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    return todo


@router.put("/tasks/{id}", response_model=TodoRead)
async def update_task(
    user_id: str = Path(..., description="The ID of the user"),
    id: str = Path(..., description="The ID of the task"),
    todo_update: TodoUpdate = None,
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID for a specific user
    """
    # Verify user owns the resource
    # In a real implementation, this would be done via middleware

    todo = get_todo_by_id_service(session=session, todo_id=id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    updated_todo = update_todo_service(
        session=session,
        todo_id=id,
        todo_update=todo_update
    )

    return updated_todo


@router.delete("/tasks/{id}")
async def delete_task(
    user_id: str = Path(..., description="The ID of the user"),
    id: str = Path(..., description="The ID of the task"),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID for a specific user
    """
    # Verify user owns the resource
    # In a real implementation, this would be done via middleware

    todo = get_todo_by_id_service(session=session, todo_id=id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    success = delete_todo_service(session=session, todo_id=id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return {"success": True, "message": "Task deleted successfully"}


@router.patch("/tasks/{id}/complete")
async def toggle_task_completion(
    user_id: str = Path(..., description="The ID of the user"),
    id: str = Path(..., description="The ID of the task"),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task
    """
    # Verify user owns the resource
    # In a real implementation, this would be done via middleware

    todo = get_todo_by_id_service(session=session, todo_id=id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if todo.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    updated_todo = toggle_todo_completion_service(session=session, todo_id=id)

    return {"success": True, "todo": updated_todo}