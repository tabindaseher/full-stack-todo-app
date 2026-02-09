from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from sqlmodel import Session
from typing import List, Optional
from app.database.session import get_session
from app.services.task import TaskService
from app.models.task import TaskCreate
from app.schemas.task import TaskUpdate, TaskResponse
from app.auth.jwt import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/{user_id}/tasks", response_model=List[TaskResponse], tags=["tasks"])
def list_tasks(
    user_id: str = Path(..., description="User ID from JWT token"),
    status: Optional[str] = Query(None, description="Filter by status (completed, pending)"),
    limit: int = Query(100, ge=1, le=1000, description="Limit number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tasks for the authenticated user with optional filters
    """
    logger.info(f"list_tasks called - path user_id: {user_id}, token user_id: {current_user}")
    
    # Verify that the user_id in the path matches the user_id from the token
    if not user_id or not current_user or user_id != current_user:
        logger.warning(f"Authorization failed - path user_id: {user_id}, token user_id: {current_user}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )
    
    try:
        # Convert status parameter to completed filter
        completed = None
        if status:
            if status.lower() == "completed":
                completed = True
            elif status.lower() == "pending":
                completed = False

        tasks = TaskService.get_tasks_by_user(
            session=session,
            user_id=current_user,
            completed=completed,
            skip=offset,
            limit=limit
        )

        return tasks
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error listing tasks for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving tasks"
        )


from pydantic import BaseModel

class CreateTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None

class UpdateTaskRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, tags=["tasks"])
def create_task(
    user_id: str = Path(..., description="User ID from JWT token"),
    task_data: CreateTaskRequest = None,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user
    """
    logger.info(f"create_task called - path user_id: {user_id}, token user_id: {current_user}, task_data: {task_data}")
    
    # Verify that the user_id in the path matches the user_id from the token
    if not user_id or not current_user or user_id != current_user:
        logger.warning(f"Authorization failed - path user_id: {user_id}, token user_id: {current_user}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )
    
    # Validate required fields
    if not task_data or not task_data.title:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title is required"
        )
    
    try:
        # Create the task using the service
        task_create = TaskCreate(
            title=task_data.title,
            description=task_data.description,
            completed=False,  # New tasks are not completed by default
            user_id=current_user,
            due_date=None,  # Not specified in the spec
            priority="medium"  # Default priority
        )

        task_response = TaskService.create_task(
            session=session,
            task_create=task_create
        )

        return task_response
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error creating task for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating task"
        )


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse, tags=["tasks"])
def get_task(
    user_id: str = Path(..., description="User ID from JWT token"),
    task_id: int = Path(..., description="Task ID"),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the authenticated user
    """
    # Verify that the user_id in the path matches the user_id from the token
    if not user_id or not current_user or user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )
    
    try:
        task = TaskService.get_task_by_id(
            session=session,
            task_id=task_id,
            user_id=current_user
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error getting task {task_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving task"
        )


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse, tags=["tasks"])
def update_task(
    user_id: str = Path(..., description="User ID from JWT token"),
    task_id: int = Path(..., description="Task ID"),
    task_data: UpdateTaskRequest = None,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task for the authenticated user
    """
    # Verify that the user_id in the path matches the user_id from the token
    if not user_id or not current_user or user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's tasks"
        )
    
    try:
        # Create update object with provided values
        task_update_data = {}
        if task_data.title is not None:
            task_update_data['title'] = task_data.title
        if task_data.description is not None:
            task_update_data['description'] = task_data.description
        if task_data.completed is not None:
            task_update_data['completed'] = task_data.completed

        # Create a TaskUpdate instance
        task_update = TaskUpdate(**task_update_data)

        task = TaskService.update_task(
            session=session,
            task_id=task_id,
            user_id=current_user,
            task_update=task_update
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error updating task {task_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating task"
        )


@router.delete("/{user_id}/tasks/{task_id}", tags=["tasks"])
def delete_task(
    user_id: str = Path(..., description="User ID from JWT token"),
    task_id: int = Path(..., description="Task ID"),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task for the authenticated user
    """
    # Verify that the user_id in the path matches the user_id from the token
    if not user_id or not current_user or user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user's tasks"
        )
    
    try:
        success = TaskService.delete_task(
            session=session,
            task_id=task_id,
            user_id=current_user
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return {"message": "Task deleted successfully"}
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error deleting task {task_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting task"
        )


class UpdateTaskCompletionRequest(BaseModel):
    completed: bool

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse, tags=["tasks"])
def update_task_completion(
    user_id: str = Path(..., description="User ID from JWT token"),
    task_id: int = Path(..., description="Task ID"),
    completion_data: UpdateTaskCompletionRequest = None,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update the completion status of a specific task for the authenticated user
    """
    # Verify that the user_id in the path matches the user_id from the token
    if not user_id or not current_user or user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's tasks"
        )
    
    try:
        # First, get the current task to update
        task = TaskService.get_task_by_id(
            session=session,
            task_id=task_id,
            user_id=current_user
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        # Update the completion status
        task_update = TaskUpdate(completed=completion_data.completed)
        updated_task = TaskService.update_task(
            session=session,
            task_id=task_id,
            user_id=current_user,
            task_update=task_update
        )

        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return updated_task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error updating completion status for task {task_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating task completion status"
        )