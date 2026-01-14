# Database Schema Specification

## Database System
- **Primary Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLModel for type-safe database interactions
- **Connection**: Configured via DATABASE_URL environment variable

## Tables

### Users Table
Managed by Better Auth system, referenced by foreign keys in application tables.

### Tasks Table
- **Table Name**: `tasks`
- **Fields**:
  - `id`: Integer, Primary Key, Auto-increment
  - `user_id`: String, Foreign Key referencing Better Auth user ID, Not Null
  - `title`: String, 1-200 characters, Not Null
  - `description`: Text, Optional, Max 1000 characters
  - `completed`: Boolean, Default False
  - `created_at`: DateTime, Default current timestamp, Not Null
  - `updated_at`: DateTime, Automatically updated on modification, Not Null
  - `due_date`: DateTime, Optional

## Relationships
- **User to Tasks**: One-to-Many relationship (one user can have many tasks)
- **Foreign Key Constraint**: `tasks.user_id` references Better Auth user ID

## Indexes
- **Primary Index**: `id` (automatically created)
- **Performance Indexes**:
  - Composite index on `(user_id, created_at)` for efficient user task retrieval and sorting
  - Index on `user_id` for filtering tasks by owner
  - Index on `completed` for filtering completed/incomplete tasks
  - Index on `due_date` for due date queries (if present)

## Constraints
- **Title Length**: Minimum 1 character, Maximum 200 characters
- **Description Length**: Maximum 1000 characters (nullable)
- **Required Fields**: `user_id`, `title` must not be null
- **Default Values**: `completed` defaults to False, `created_at` and `updated_at` are automatically managed

## Data Integrity
- **Referential Integrity**: Foreign key constraint ensures tasks reference valid users
- **Timestamp Management**: Automated creation and updating of timestamps
- **User Isolation**: All queries must filter by user_id to ensure data isolation

## Security Considerations
- **Access Control**: Application layer enforces user_id matching for all operations
- **Data Separation**: Physical separation achieved through user_id foreign key relationships
- **Audit Trail**: Timestamps provide basic audit capability for task lifecycle