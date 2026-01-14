from fastapi import APIRouter
from app.api.v1 import tasks, auth


api_router = APIRouter()
api_router.include_router(tasks.router, prefix="/todos", tags=["todos"])  # Changed from /tasks to /todos to match frontend
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])