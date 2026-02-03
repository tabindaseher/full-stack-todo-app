# Full-Stack Todo Application

A modern full-stack todo application built with Next.js, FastAPI, and PostgreSQL/NeonDB.

## Features

- User authentication (register/login/logout)
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Due dates for tasks
- Priority levels (low, medium, high)
- Responsive UI design
- Secure JWT-based authentication

## Tech Stack

### Frontend
- **Next.js** - React framework for server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form management

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQL database modeling
- **PostgreSQL/NeonDB** - Database
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **Passlib/Bcrypt** - Password hashing
- **Python-Jose** - JWT token handling

### Deployment
- **Vercel** - Frontend hosting
- **Hugging Face Spaces** - Backend hosting
- **NeonDB** - Cloud PostgreSQL database

## Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API routes (auth, todos)
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── auth/           # Authentication utilities
│   │   ├── database/       # Database configuration
│   │   └── core/           # Core configuration
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── .env.example       # Environment variables template
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API service
│   │   └── utils/          # Utility functions
│   ├── next.config.js      # Next.js configuration
│   └── package.json        # Node.js dependencies
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL or NeonDB account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your backend URL
```

4. Start the frontend development server:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@host:port/database
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
ALLOWED_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `POST /api/auth/refresh` - Refresh access token

### Todos
- `GET /api/todos` - Get all todos for the authenticated user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update a specific todo
- `DELETE /api/todos/{id}` - Delete a specific todo
- `PATCH /api/todos/{id}/complete` - Toggle todo completion status

## Database Migrations

To create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

To apply migrations:
```bash
alembic upgrade head
```

## Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Hugging Face Spaces)
1. Create a Space with Docker container option
2. Configure environment variables
3. Build and deploy

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- SQL injection prevention with SQLModel

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue in the repository.