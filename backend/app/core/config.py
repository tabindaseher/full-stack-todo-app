from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    LOG_LEVEL: str = "INFO"
    DB_POOL_SIZE: int = 20
    DB_POOL_TIMEOUT: int = 30

    # Database configuration
    DATABASE_URL: str

    # Authentication configuration
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str

    # OpenAI configuration
    OPENAI_KEY: Optional[str] = None

    # CORS configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:3003", 
        "https://frontend-five-ecru-11.vercel.app",  # Your deployed frontend
        "https://tabindaseher-full-stack-todo-app.hf.space"  # Your deployed backend
    ]  # More restrictive default

    class Config:
        env_file = ".env"


settings = Settings()