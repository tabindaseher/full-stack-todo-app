# Data Model: Backend Todo API

## Entities

### User
Represents an authenticated user with JWT token for API authentication.

**Fields**:
- `id: str` - Unique identifier for the user (UUID)
- `email: str` - User's email address (used for login), unique constraint
- `name: str` - Display name for the user
- `hashed_password: str` - Bcrypt-hashed password for secure storage
- `created_at: datetime` - Timestamp when user was created
- `updated_at: datetime` - Timestamp when user was last updated
- `is_active: bool` - Whether the user account is active (default: True)

**Validation Rules**:
- Email must be valid email format
- Name must be 1-100 characters
- Hashed password must be properly formatted bcrypt hash
- Created_at and updated_at must be valid ISO datetime strings
- Is_active must be boolean

**Relationships**:
- One-to-many: One user can have many todos (foreign key in Todo table)

### Todo
Represents a task with properties for tracking status and metadata.

**Fields**:
- `id: str` - Unique identifier for the todo (UUID)
- `title: str` - Title of the todo (required, max 255 characters)
- `description: str | None` - Optional detailed description (max 1000 characters)
- `completed: bool` - Status indicating if todo is completed (default: False)
- `user_id: str` - Owner of the todo for data isolation (foreign key to User.id)
- `priority: str` - Priority level for sorting/filtering ('low' | 'medium' | 'high', default: 'medium')
- `due_date: datetime | None` - Optional deadline for the todo
- `created_at: datetime` - Timestamp when todo was created
- `updated_at: datetime` - Timestamp when todo was last updated

**Validation Rules**:
- Title must be 1-255 characters
- Description, if provided, must be 0-1000 characters
- Completed must be boolean
- User_id must reference an existing user
- Priority must be one of 'low', 'medium', or 'high'
- Created_at and updated_at must be valid ISO datetime strings
- Due_date, if provided, must be a future date

**State Transitions**:
- `pending` → `completed` when checkbox is toggled via PATCH /complete endpoint
- `completed` → `pending` when checkbox is toggled via PATCH /complete endpoint
- `created` → `updated` when any field changes via PUT endpoint

## Relationships

### Todo → User
- One-to-many: One user can have many todos
- Foreign Key: Todo.user_id references User.id
- Constraint: Todos can only be accessed by their owner (user_id)

## Database Schema

### users table
```
id: UUID (PRIMARY KEY)
email: VARCHAR(255) UNIQUE NOT NULL
name: VARCHAR(100) NOT NULL
hashed_password: TEXT NOT NULL
created_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
is_active: BOOLEAN DEFAULT TRUE
```

### todos table
```
id: UUID (PRIMARY KEY)
title: VARCHAR(255) NOT NULL
description: TEXT
completed: BOOLEAN DEFAULT FALSE
user_id: UUID REFERENCES users(id) ON DELETE CASCADE
priority: VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'))
due_date: TIMESTAMP WITH TIME ZONE
created_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```

## Indexes
- Index on users.email for fast login lookups
- Index on todos.user_id for efficient user-specific queries
- Index on todos.completed for filtering completed/incomplete tasks
- Index on todos.priority for priority-based sorting
- Composite index on (todos.user_id, todos.created_at DESC) for efficient user task listing

## Constraints
- Foreign key constraint ensures todos.user_id references valid users.id
- Cascade delete removes all todos when a user is deleted
- Check constraint ensures priority field only accepts valid values
- Unique constraint on email prevents duplicate user accounts