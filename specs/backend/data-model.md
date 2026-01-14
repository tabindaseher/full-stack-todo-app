# Data Model for Backend Todo Application

## Entity: Task

### Fields
- **id**: Integer
  - Type: Integer, Primary Key, Auto-increment
  - Validation: Auto-generated, not nullable
  - Description: Unique identifier for each task

- **user_id**: String
  - Type: String
  - Validation: Not nullable, foreign key reference to Better Auth user ID
  - Description: Links task to the user who owns it

- **title**: String
  - Type: String
  - Validation: 1-200 characters, not nullable
  - Description: Title of the task

- **description**: Text
  - Type: Text (optional)
  - Validation: Max 1000 characters, nullable
  - Description: Optional detailed description of the task

- **completed**: Boolean
  - Type: Boolean
  - Validation: Default False, not nullable
  - Description: Indicates whether the task is completed

- **created_at**: DateTime
  - Type: DateTime
  - Validation: Default current timestamp, not nullable
  - Description: Timestamp when the task was created

- **updated_at**: DateTime
  - Type: DateTime
  - Validation: Automatically updated on modification, not nullable
  - Description: Timestamp when the task was last updated

- **due_date**: DateTime
  - Type: DateTime (optional)
  - Validation: Nullable
  - Description: Optional deadline for the task

### Relationships
- **User to Task**: One-to-Many
  - One user can own many tasks
  - Foreign key constraint ensures referential integrity
  - All operations require user_id matching for authorization

### Validation Rules
- Title must be between 1 and 200 characters
- Description must not exceed 1000 characters
- User must be authenticated and own the task for any operations
- Only the task owner can modify or delete the task

### State Transitions
- **Created**: When a new task is added (completed=False initially)
- **Updated**: When any field except ID is modified
- **Completed**: When the completed field is set to True
- **Deleted**: When the task is removed from the database

## Entity: User (Managed by Better Auth)

### Fields
- **id**: String
  - Type: String
  - Validation: Provided by Better Auth, not nullable
  - Description: Unique identifier from Better Auth system

### Relationships
- **User to Task**: One-to-Many
  - One user can own many tasks
  - All tasks must have a valid user_id referencing a user

### Validation Rules
- User must be authenticated to access any task endpoints
- User can only access tasks they own
- User identity verified through JWT token validation