#!/bin/bash

# Startup script for the Todo Backend API

echo "Starting Todo Backend API..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "env" ]; then
    source env/bin/activate
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi

# Run the application with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo "Todo Backend API stopped."