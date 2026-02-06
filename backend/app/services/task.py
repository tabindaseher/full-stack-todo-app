from sqlmodel import Session, select
from app.models.task import Task, TaskCreate
from app.schemas.task import TaskUpdate, TaskResponse
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException, status


class TaskService:
    """
    Service class for handling task-related business logic
    """

    @staticmethod
    def create_task(*, session: Session, task_create: TaskCreate) -> TaskResponse:
        """
        Create a new task for a user
        """
        db_task = Task(
            title=task_create.title,
            description=task_create.description,
            completed=task_create.completed,
            user_id=task_create.user_id,
            due_date=task_create.due_date,
            priority=task_create.priority,  # Now that TaskCreate has priority field
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(db_task)
        session.commit()
        session.refresh(db_task)

        # Convert to response model
        return TaskResponse(
            id=db_task.id,
            title=db_task.title,
            description=db_task.description,
            completed=db_task.completed,
            user_id=db_task.user_id,
            due_date=db_task.due_date,
            priority=db_task.priority,
            created_at=db_task.created_at,
            updated_at=db_task.updated_at
        )

    @staticmethod
    def get_task_by_id(*, session: Session, task_id: int, user_id: str) -> Optional[TaskResponse]:
        """
        Get a specific task by ID for a specific user
        """
        statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
        db_task = session.exec(statement).first()

        if not db_task:
            return None

        return TaskResponse(
            id=db_task.id,
            title=db_task.title,
            description=db_task.description,
            completed=db_task.completed,
            user_id=db_task.user_id,
            due_date=db_task.due_date,
            priority=db_task.priority,
            created_at=db_task.created_at,
            updated_at=db_task.updated_at
        )

    @staticmethod
    def get_tasks_by_user(*, session: Session, user_id: str, completed: Optional[bool] = None,
                         skip: int = 0, limit: int = 100) -> List[TaskResponse]:
        """
        Get all tasks for a specific user with optional filters
        """
        statement = select(Task).where(Task.user_id == user_id)

        if completed is not None:
            statement = statement.where(Task.completed == completed)

        statement = statement.offset(skip).limit(limit)
        db_tasks = session.exec(statement).all()

        tasks = []
        for db_task in db_tasks:
            tasks.append(TaskResponse(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                due_date=db_task.due_date,
                priority=db_task.priority,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            ))

        return tasks

    @staticmethod
    def update_task(*, session: Session, task_id: int, user_id: str,
                   task_update: TaskUpdate) -> Optional[TaskResponse]:
        """
        Update a specific task for a specific user
        """
        try:
            statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
            db_task = session.exec(statement).first()

            if not db_task:
                return None

            # Update the task fields
            update_data = task_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                if hasattr(db_task, field):
                    setattr(db_task, field, value)

            db_task.updated_at = datetime.utcnow()
            session.add(db_task)
            session.commit()
            session.refresh(db_task)

            return TaskResponse(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                due_date=db_task.due_date,
                priority=db_task.priority,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            )
        except Exception as e:
            session.rollback()
            raise e

    @staticmethod
    def delete_task(*, session: Session, task_id: int, user_id: str) -> bool:
        """
        Delete a specific task for a specific user
        """
        try:
            statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
            db_task = session.exec(statement).first()

            if not db_task:
                return False

            session.delete(db_task)
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            raise e

    @staticmethod
    def toggle_task_completion(*, session: Session, task_id: int, user_id: str) -> Optional[TaskResponse]:
        """
        Toggle the completion status of a specific task for a specific user
        """
        try:
            statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
            db_task = session.exec(statement).first()

            if not db_task:
                return None

            # Toggle the completion status
            db_task.completed = not db_task.completed
            db_task.updated_at = datetime.utcnow()

            session.add(db_task)
            session.commit()
            session.refresh(db_task)

            return TaskResponse(
                id=db_task.id,
                title=db_task.title,
                description=db_task.description,
                completed=db_task.completed,
                user_id=db_task.user_id,
                due_date=db_task.due_date,
                priority=db_task.priority,
                created_at=db_task.created_at,
                updated_at=db_task.updated_at
            )
        except Exception as e:
            session.rollback()
            raise e