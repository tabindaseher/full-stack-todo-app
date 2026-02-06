# Running Instructions for Todo Application

## Overview
This document explains how to run the full-stack Todo application locally after fixing the connectivity issues.

## Prerequisites
- Python 3.8+ installed
- Node.js and npm installed
- The required dependencies are already installed as noted in the package.json and requirements.txt files

## Configuration Files Updated
1. `backend/.env` - Changed database URL to use SQLite for easier local development
2. `frontend/.env.local` - Changed API URL to connect to local backend

## Steps to Run the Application

### 1. Start the Backend Server
Open a terminal/command prompt and navigate to the backend directory:
```bash
cd backend
```

Then start the backend server:
```bash
python -m uvicorn app.main:app --reload
```

The backend will start on `http://localhost:8000`

### 2. Start the Frontend Server
Open another terminal/command prompt and navigate to the frontend directory:
```bash
cd frontend
```

Then start the frontend development server:
```bash
npx next dev
```

The frontend will start on `http://localhost:3003` (or next available port if 3000-3002 are in use)

### 3. Access the Application
Open your browser and go to the frontend URL (likely `http://localhost:3003`)

## Troubleshooting
- If you see port conflicts, Next.js will automatically use the next available port
- Make sure both servers are running before testing the application
- The application should now properly load and save todos without the previous error messages

## Features Available
- User registration and login
- Create, read, update, and delete todos
- Set due dates and priorities for tasks
- Filter tasks by completion status
- Responsive UI design