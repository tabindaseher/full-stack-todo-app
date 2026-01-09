from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from models import Todo, TodoUpdate


def create_todo(session: Session, todo: Todo) -> Todo:
    """
    Create a new todo
    """
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


def get_todo_by_id(session: Session, todo_id: str) -> Optional[Todo]:
    """
    Get a todo by ID
    """
    statement = select(Todo).where(Todo.id == todo_id)
    return session.exec(statement).first()


def get_todos(
    session: Session,
    user_id: str,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None
) -> List[Todo]:
    """
    Get all todos for a user with optional filtering
    """
    statement = select(Todo).where(Todo.user_id == user_id)

    if status:
        if status == "active":
            statement = statement.where(Todo.completed == False)
        elif status == "completed":
            statement = statement.where(Todo.completed == True)

    if priority:
        statement = statement.where(Todo.priority == priority)

    if search:
        statement = statement.where(Todo.title.contains(search) | Todo.description.contains(search))

    statement = statement.order_by(Todo.created_at.desc())
    return session.exec(statement).all()


def update_todo(session: Session, todo_id: str, todo_update: TodoUpdate) -> Optional[Todo]:
    """
    Update a todo
    """
    todo = get_todo_by_id(session, todo_id)
    if not todo:
        return None

    # Update fields if provided
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(todo, field) and value is not None:
            setattr(todo, field, value)

    # Update the timestamp
    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


def delete_todo(session: Session, todo_id: str) -> bool:
    """
    Delete a todo
    """
    todo = get_todo_by_id(session, todo_id)
    if not todo:
        return False

    session.delete(todo)
    session.commit()

    return True


def toggle_todo_completion(session: Session, todo_id: str) -> Optional[Todo]:
    """
    Toggle the completion status of a todo
    """
    todo = get_todo_by_id(session, todo_id)
    if not todo:
        return None

    todo.completed = not todo.completed
    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo