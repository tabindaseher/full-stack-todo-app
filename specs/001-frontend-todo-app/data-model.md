# Data Model: Frontend Todo Application

## Entities

### Todo
Represents a task with properties for tracking status and metadata.

**Fields**:
- `id: string` - Unique identifier for the todo
- `title: string` - Title of the todo (required, max 200 characters)
- `description?: string` - Optional detailed description (max 1000 characters)
- `completed: boolean` - Status indicating if todo is completed
- `createdAt: Date` - Timestamp when todo was created
- `updatedAt: Date` - Timestamp when todo was last updated
- `userId: string` - Owner of the todo for data isolation
- `dueDate?: Date` - Optional deadline for the todo
- `priority: 'low' | 'medium' | 'high'` - Priority level for sorting/filtering

**Validation Rules**:
- Title must be 1-200 characters
- Description, if provided, must be 0-1000 characters
- Completed must be boolean
- createdAt and updatedAt must be valid ISO date strings
- userId must match authenticated user's ID
- Due date, if provided, must be in the future

**State Transitions**:
- `pending` → `completed` when checkbox is clicked
- `completed` → `pending` when checkbox is unclicked
- `created` → `updated` when any field changes

### User
Represents an authenticated user with JWT token for API authentication.

**Fields**:
- `id: string` - Unique identifier for the user
- `email: string` - User's email address (used for login)
- `name: string` - Display name for the user
- `jwtToken: string` - Current authentication token
- `isLoggedIn: boolean` - Authentication status
- `tokenExpiry: Date` - Expiration time for JWT token

**Validation Rules**:
- Email must be valid email format
- Name must be 1-100 characters
- jwtToken must be valid JWT format
- isLoggedIn must be boolean
- tokenExpiry must be in the future

## Relationships

### Todo → User
- One-to-many: One user can have many todos
- Foreign Key: Todo.userId references User.id
- Constraint: Todos can only be accessed by their owner (userId)

## Frontend State Models

### TodoFilters
State for managing todo filtering options.

**Fields**:
- `statusFilter: 'all' | 'active' | 'completed'` - Filter by completion status
- `priorityFilter: 'all' | 'low' | 'medium' | 'high'` - Filter by priority
- `searchQuery: string` - Text search for titles/descriptions
- `sortBy: 'createdAt' | 'dueDate' | 'priority'` - Sort ordering
- `sortOrder: 'asc' | 'desc'` - Sort direction

### UIState
State for managing UI-specific data.

**Fields**:
- `isLoading: boolean` - Whether data is being loaded
- `error: string | null` - Error message if operation failed
- `isModalOpen: boolean` - Whether modal is visible
- `currentView: 'list' | 'grid' | 'calendar'` - Todo display mode
- `animationEnabled: boolean` - Whether animations are active