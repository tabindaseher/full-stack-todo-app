import os
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Access-Control-Allow-Origin", "Authorization"]
)

# --------------------
# API Routes
# --------------------

# Determine if running in Hugging Face Space environment
# Check multiple indicators for Hugging Face Space environment
def is_hf_space_runtime():
    """Check if running in Hugging Face Space environment at runtime"""
    hf_space_id = os.getenv("HF_SPACE_ID")
    runtime_env = os.getenv("RUNTIME_ENVIRONMENT")
    hostname = os.getenv("HOSTNAME", "")
    server_name = os.getenv("SERVER_NAME", "")
    
    # Also check for common Hugging Face Space indicators
    space_repo_id = os.getenv("SPACE_REPO_ID")
    space_sdk = os.getenv("SPACE_SDK")
    is_colab = os.getenv("COLAB_RELEASE_TAG")
    is_kaggle = os.getenv("KAGGLE_KERNEL_RUN_TYPE")
    
    # Additional check: if the server name contains the user's space name pattern
    # This handles cases where the hostname doesn't end with .hf.space but is still a HF space
    server_url = os.getenv("SERVER_URL", "")
    space_hostname = os.getenv("SPACE_HOSTNAME", "")  # Specific to Hugging Face Spaces
    
    is_hf = bool(hf_space_id) or runtime_env == "huggingface" or \
            bool(space_repo_id) or bool(space_sdk) or \
            "huggingface" in hostname.lower() or \
            "huggingface" in server_name.lower() or \
            "huggingface" in server_url.lower() or \
            hostname.endswith(".hf.space") or \
            server_name.endswith(".hf.space") or \
            server_url.endswith(".hf.space") or \
            space_hostname.endswith(".hf.space") or \
            bool(is_colab) or bool(is_kaggle)

    return is_hf

runtime_is_hf_space = is_hf_space_runtime()
force_api_prefix = settings.force_api_prefix
# Allow forcing root routes even when environment detection fails
force_root_routes = os.getenv("FORCE_ROOT_ROUTES", "").lower() == "true"

logger.info(f"Environment detection - is_hf_space: {runtime_is_hf_space}")
logger.info(f"Force API prefix: {force_api_prefix}")
logger.info(f"Force root routes: {force_root_routes}")
logger.info(f"Host: {os.getenv('HOSTNAME', 'not set')}")
logger.info(f"Server name: {os.getenv('SERVER_NAME', 'not set')}")
logger.info(f"Runtime environment: {os.getenv('RUNTIME_ENVIRONMENT', 'not set')}")
logger.info(f"HF Space ID: {os.getenv('HF_SPACE_ID', 'not set')}")
logger.info(f"SPACE_REPO_ID: {os.getenv('SPACE_REPO_ID', 'not set')}")
logger.info(f"SPACE_SDK: {os.getenv('SPACE_SDK', 'not set')}")

if (runtime_is_hf_space and not force_api_prefix) or force_root_routes:
    # For Hugging Face Spaces, mount routes at root level
    # Or if force_root_routes is enabled
    logger.info("Using root routes - either Hugging Face Space environment or forced root routes")
    app.include_router(api_router)
else:
    # For local development and other environments, use /api prefix
    # Also use /api prefix if force_api_prefix is set to true
    logger.info("Using /api prefix routes")
    app.include_router(api_router, prefix="/api")

# --------------------
# Startup Event
# --------------------
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        logger.info(f"Starting up - Database URL: {settings.DATABASE_URL}")
        logger.info(f"HF Space environment (runtime): {runtime_is_hf_space}")
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
