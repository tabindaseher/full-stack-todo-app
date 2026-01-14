import logging
import time
import uuid
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp, Receive, Scope, Send


logger = logging.getLogger(__name__)


async def logging_middleware(request: Request, call_next):
    """
    Request logging middleware that logs incoming requests
    """
    request_id = str(uuid.uuid4())
    start_time = time.time()

    # Extract user ID from token if available (without validating)
    auth_header = request.headers.get("Authorization")
    user_id = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        # For logging purposes, we won't validate the token here
        # Actual validation happens in auth middleware
        user_id = "authenticated_user"  # We'll get the real user ID after validation

    # Log the incoming request
    logger.info({
        "event": "request_started",
        "request_id": request_id,
        "method": request.method,
        "path": request.url.path,
        "user_id": user_id,
        "client": request.client.host if request.client else None
    })

    try:
        response = await call_next(request)
    except Exception as e:
        # Log any errors that occur
        process_time = time.time() - start_time
        logger.error({
            "event": "request_failed",
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": getattr(response, 'status_code', 500),
            "process_time": f"{process_time:.4f}s",
            "error": str(e),
            "user_id": user_id
        })
        raise

    # Calculate processing time
    process_time = time.time() - start_time

    # Log the completed request
    logger.info({
        "event": "request_completed",
        "request_id": request_id,
        "method": request.method,
        "path": request.url.path,
        "status_code": response.status_code,
        "process_time": f"{process_time:.4f}s",
        "user_id": user_id
    })

    return response