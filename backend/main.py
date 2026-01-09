from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import tasks, auth
from config import settings
from database import create_db_and_tables

app = FastAPI(title=settings.APP_NAME, version=settings.API_VERSION)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routers
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Todo Backend API", "version": settings.API_VERSION}

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": settings.API_VERSION}