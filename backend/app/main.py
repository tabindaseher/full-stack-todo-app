from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.middleware.errors import error_handler_middleware
from app.middleware.logging import logging_middleware
from app.database.session import engine
from app.models.user import User
from app.models.task import Task
from sqlmodel import SQLModel
import logging

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL.upper())
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title="Todo Backend API",
    version="1.0.0",
    description="API for managing tasks in a multi-user Todo application"
)

# Add logging middleware first (to log all requests)
@app.middleware("http")
async def add_logging(request, call_next):
    response = await logging_middleware(request, call_next)
    return response

# Add error handler middleware
@app.middleware("http")
async def add_error_handler(request, call_next):
    response = await error_handler_middleware(request, call_next)
    return response

# --------------------
# CORS Middleware
# --------------------
origins = [
    "http://localhost:3000",  # local frontend
    "https://frontend-five-ecru-11.vercel.app"  # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Access-Control-Allow-Origin", "Authorization"]
)

# --------------------
# API Routes
# --------------------
app.include_router(api_router, prefix="/api")

# --------------------
# Startup Event
# --------------------
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        SQLModel.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

# --------------------
# Root & Health Endpoints
# --------------------
@app.get("/")
async def root():
    return {"message": "Backend is running!"}

@app.get("/health")
async def health_check():
    try:
        from sqlmodel import select
        from app.database.session import get_session

        with next(get_session()) as session:
            user_count = session.exec(select(User)).all()

        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database_connected": True,
            "user_count": len(user_count)
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database_connected": False,
            "error": str(e)
        }

# --------------------
# Debug / Database Test
# --------------------
@app.get("/debug/db-test")
async def db_test():
    try:
        from sqlmodel import select
        from app.database.session import get_session

        with next(get_session()) as session:
            user_count = session.exec(select(User)).all()

        return {
            "database_accessible": True,
            "user_table_exists": True,
            "user_count": len(user_count),
            "message": "Database connection successful"
        }
    except Exception as e:
        logger.error(f"Database test failed: {str(e)}")
        return {
            "database_accessible": False,
            "error": str(e),
            "message": "Database connection failed"
        }

# --------------------
# Run with Uvicorn
# --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
