from fastapi import APIRouter
from app.api.v1 import tasks, auth


api_router = APIRouter()
api_router.include_router(tasks.router, tags=["tasks"])  # Using the new routes with user_id in path
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])