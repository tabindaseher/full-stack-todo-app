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

    @property
    def is_hf_space(self) -> bool:
        """Check if running in Hugging Face Space environment"""
        import os
        # Check multiple indicators for Hugging Face Space environment
        hf_space_id = os.getenv("HF_SPACE_ID")
        runtime_env = os.getenv("RUNTIME_ENVIRONMENT")
        hostname = os.getenv("HOSTNAME", "")
        server_name = os.getenv("SERVER_NAME", "")
        
        is_hf = bool(hf_space_id) or runtime_env == "huggingface" or \
                "huggingface" in hostname.lower() or \
                "huggingface" in server_name.lower() or \
                hostname.endswith(".hf.space") or \
                server_name.endswith(".hf.space")
                
        return is_hf


settings = Settings()