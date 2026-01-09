from sqlmodel import Session, select
from typing import Optional
from models import User, UserCreate
from utils.auth import get_password_hash


def create_user(session: Session, user_create: UserCreate) -> User:
    """
    Create a new user with hashed password
    """
    # Hash the password
    hashed_password = get_password_hash(user_create.password)

    # Create user object
    db_user = User(
        email=user_create.email,
        name=user_create.name,
        hashed_password=hashed_password
    )

    # Add to session and commit
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def get_user_by_id(session: Session, user_id: str) -> Optional[User]:
    """
    Get a user by ID
    """
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()


def get_user_by_email(session: Session, email: str) -> Optional[User]:
    """
    Get a user by email
    """
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def update_user(session: Session, user_id: str, user_update: dict) -> Optional[User]:
    """
    Update a user
    """
    db_user = get_user_by_id(session, user_id)
    if not db_user:
        return None

    # Update fields if provided
    for field, value in user_update.items():
        if hasattr(db_user, field) and value is not None:
            setattr(db_user, field, value)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def delete_user(session: Session, user_id: str) -> bool:
    """
    Delete a user
    """
    db_user = get_user_by_id(session, user_id)
    if not db_user:
        return False

    session.delete(db_user)
    session.commit()

    return True