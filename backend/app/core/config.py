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

    # CORS configuration
    ALLOWED_ORIGINS: List[str] = ["*"]  # Default to allow all in development

    class Config:
        env_file = ".env"


settings = Settings()