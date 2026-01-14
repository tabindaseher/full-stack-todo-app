from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
from app.database.session import get_session
from app.services.task import TaskService
from app.models.task import TaskCreate
from app.schemas.task import TaskUpdate, TaskResponse, TaskListResponse, TaskToggleResponse, ErrorResponse
from app.auth.jwt import get_current_user
from app.middleware.auth import JWTBearer
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/", response_model=List[TaskResponse])
def list_todos(
    status: Optional[str] = Query(None, description="Filter by status (completed, pending)"),
    limit: int = Query(100, ge=1, le=1000, description="Limit number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    List all tasks for the authenticated user with optional filters
    """
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
    except Exception as e:
        logger.error(f"Error listing todos for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving todos"
        )


from pydantic import BaseModel

class CreateTodoRequest(BaseModel):
    title: str
    description: Optional[str] = None
    dueDate: Optional[str] = None
    priority: Optional[str] = None

class UpdateTodoRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    dueDate: Optional[str] = None
    priority: Optional[str] = None

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_data: CreateTodoRequest,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new todo for the authenticated user
    """
    try:
        # Parse dueDate if provided
        from datetime import datetime
        due_date_obj = None
        if todo_data.dueDate:
            try:
                due_date_obj = datetime.fromisoformat(todo_data.dueDate.replace('Z', '+00:00'))
            except ValueError:
                # If parsing fails, try other common formats
                try:
                    due_date_obj = datetime.strptime(todo_data.dueDate, '%Y-%m-%d')
                except ValueError:
                    pass  # Leave as None if parsing fails

        # Create the task using the service
        # Determine priority with proper fallback
        priority_value = "medium"  # Default priority
        if todo_data.priority and isinstance(todo_data.priority, str) and todo_data.priority.strip():
            # Validate that priority is one of the allowed values
            if todo_data.priority.lower() in ["low", "medium", "high"]:
                priority_value = todo_data.priority.lower()

        task_create = TaskCreate(
            title=todo_data.title,
            description=todo_data.description,
            completed=False,  # New todos are not completed by default
            user_id=current_user,
            due_date=due_date_obj,
            priority=priority_value
        )

        task_response = TaskService.create_task(
            session=session,
            task_create=task_create
        )

        return task_response
    except Exception as e:
        logger.error(f"Error creating todo for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating todo"
        )


@router.get("/{todo_id}", response_model=TaskResponse)
def get_todo(
    todo_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific todo by ID for the authenticated user
    """
    try:
        task = TaskService.get_task_by_id(
            session=session,
            task_id=todo_id,
            user_id=current_user
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )

        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error getting todo {todo_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving todo"
        )


@router.put("/{todo_id}", response_model=TaskResponse)
def update_todo(
    todo_id: int,
    todo_data: UpdateTodoRequest,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific todo for the authenticated user
    """
    try:
        # Parse dueDate if provided
        from datetime import datetime
        due_date_obj = None
        if todo_data.dueDate:
            try:
                due_date_obj = datetime.fromisoformat(todo_data.dueDate.replace('Z', '+00:00'))
            except ValueError:
                # If parsing fails, try other common formats
                try:
                    due_date_obj = datetime.strptime(todo_data.dueDate, '%Y-%m-%d')
                except ValueError:
                    pass  # Leave as None if parsing fails

        # Create update object with provided values
        task_update_data = {}
        if todo_data.title is not None:
            task_update_data['title'] = todo_data.title
        if todo_data.description is not None:
            task_update_data['description'] = todo_data.description
        if todo_data.completed is not None:
            task_update_data['completed'] = todo_data.completed
        if due_date_obj is not None:
            task_update_data['due_date'] = due_date_obj
        if todo_data.priority is not None:
            # Validate and normalize priority value
            if isinstance(todo_data.priority, str) and todo_data.priority.strip():
                if todo_data.priority.lower() in ["low", "medium", "high"]:
                    task_update_data['priority'] = todo_data.priority.lower()

        # Create a TaskUpdate instance
        task_update = TaskUpdate(**task_update_data)

        task = TaskService.update_task(
            session=session,
            task_id=todo_id,
            user_id=current_user,
            task_update=task_update
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )

        return task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error updating todo {todo_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating todo"
        )


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo for the authenticated user
    """
    try:
        success = TaskService.delete_task(
            session=session,
            task_id=todo_id,
            user_id=current_user
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )

        return {"message": "Todo deleted successfully"}
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error deleting todo {todo_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting todo"
        )


class UpdateTodoCompletionRequest(BaseModel):
    completed: bool

@router.patch("/{todo_id}/complete", response_model=TaskResponse)
def update_todo_completion(
    todo_id: int,
    completion_data: UpdateTodoCompletionRequest,  # Accept completed status from request body
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update the completion status of a specific todo for the authenticated user
    """
    try:
        # First, get the current task to update
        task = TaskService.get_task_by_id(
            session=session,
            task_id=todo_id,
            user_id=current_user
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )

        # Update the completion status
        task_update = TaskUpdate(completed=completion_data.completed)
        updated_task = TaskService.update_task(
            session=session,
            task_id=todo_id,
            user_id=current_user,
            task_update=task_update
        )

        if not updated_task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )

        return updated_task
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error updating completion status for todo {todo_id} for user {current_user}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating todo completion status"
        )