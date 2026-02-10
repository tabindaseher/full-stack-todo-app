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
        
        # Also check for common Hugging Face Space indicators
        space_repo_id = os.getenv("SPACE_REPO_ID")
        space_sdk = os.getenv("SPACE_SDK")
        is_colab = os.getenv("COLAB_RELEASE_TAG")
        is_kaggle = os.getenv("KAGGLE_KERNEL_RUN_TYPE")

        is_hf = bool(hf_space_id) or runtime_env == "huggingface" or \
                bool(space_repo_id) or bool(space_sdk) or \
                "huggingface" in hostname.lower() or \
                "huggingface" in server_name.lower() or \
                hostname.endswith(".hf.space") or \
                server_name.endswith(".hf.space") or \
                bool(is_colab) or bool(is_kaggle)

        return is_hf
    
    @property
    def force_api_prefix(self) -> bool:
        """Check if API prefix should be forced regardless of environment detection"""
        import os
        return os.getenv("FORCE_API_PREFIX", "").lower() == "true"


settings = Settings()