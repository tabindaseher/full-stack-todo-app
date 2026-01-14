# CORS configuration is handled directly in main.py using FastAPI's built-in CORSMiddleware
# This file exists to fulfill the task structure but contains no additional implementation
from fastapi.middleware.cors import CORSMiddleware

# See app.main:app.add_middleware(CORSMiddleware, ...) for implementation