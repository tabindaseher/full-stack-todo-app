@echo off
REM Startup script for the Todo Backend API on Windows

echo Starting Todo Backend API...

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else if exist "env\Scripts\activate.bat" (
    call env\Scripts\activate.bat
)

REM Install dependencies if requirements.txt exists
if exist "requirements.txt" (
    pip install -r requirements.txt
)

REM Run the application with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo Todo Backend API stopped.
pause