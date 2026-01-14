import logging
import traceback
from fastapi import HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send
from datetime import datetime
import uuid


logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next):
    """
    Global error handler middleware that catches unhandled exceptions
    and returns standardized error responses
    """
    request_id = str(uuid.uuid4())

    try:
        response = await call_next(request)
        return response
    except HTTPException as e:
        # Handle HTTP exceptions (404, 401, etc.)
        logger.warning(f"HTTPException {e.status_code}: {e.detail} (Request ID: {request_id})")

        return JSONResponse(
            status_code=e.status_code,
            content={
                "detail": e.detail,
                "error_code": getattr(e, 'error_code', f"HTTP_{e.status_code}"),
                "timestamp": datetime.utcnow().isoformat(),
                "request_id": request_id
            }
        )
    except Exception as e:
        # Handle unexpected exceptions
        error_msg = str(e)
        logger.error(f"Unhandled exception: {error_msg} (Request ID: {request_id})")
        logger.error(traceback.format_exc())

        # In production, don't expose internal error details
        detail_msg = "Internal server error"
        error_code = "INTERNAL_ERROR"

        return JSONResponse(
            status_code=500,
            content={
                "detail": detail_msg,
                "error_code": error_code,
                "timestamp": datetime.utcnow().isoformat(),
                "request_id": request_id
            }
        )