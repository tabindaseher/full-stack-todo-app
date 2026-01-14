# Data Model: Frontend State for Multi-User Todo Application

## Frontend State Entities

### UserSession
**Description**: Represents the authenticated user state in the frontend application

**Fields**:
- `id` (string): Unique identifier for the user
- `email` (string): User's email address
- `name` (string): User's full name
- `token` (string): JWT access token
- `refreshToken` (string): JWT refresh token (optional)
- `isAuthenticated` (boolean): Authentication status
- `isLoading` (boolean): Loading state for auth operations
- `error` (string | null): Error message if auth failed

**Validation Rules**:
- `email` must be a valid email format
- `token` must be a valid JWT token
- `isAuthenticated` is true only when token is valid

### TodoItem
**Description**: Represents an individual todo task in the frontend

**Fields**:
- `id` (string): Unique identifier for the todo
- `title` (string): Title of the todo (required)
- `description` (string): Detailed description (optional)
- `completed` (boolean): Completion status
- `dueDate` (string | null): Due date in ISO format (optional)
- `priority` (string): Priority level (low, medium, high)
- `createdAt` (string): Creation timestamp in ISO format
- `updatedAt` (string): Last update timestamp in ISO format
- `userId` (string): ID of the user who owns this todo

**Validation Rules**:
- `title` must be 1-200 characters
- `priority` must be one of: 'low', 'medium', 'high'
- `dueDate` must be a valid future date if provided
- `userId` must match the authenticated user's ID

### UIState
**Description**: Represents various UI states for loading, error handling, and user preferences

**Fields**:
- `loadingStates` (object): Map of loading states by operation
- `errorMessages` (array): List of current error messages
- `preferences` (object): User preferences like theme, language
- `modalState` (object): Current modal visibility and data
- `filterState` (object): Current todo list filters and sorting

**Validation Rules**:
- `loadingStates` keys must be valid operation identifiers
- `errorMessages` must be strings with proper error context
- `preferences` must conform to defined preference schema

### FormState
**Description**: Represents state for various forms in the application

**Fields**:
- `values` (object): Current form field values
- `errors` (object): Field-specific error messages
- `touched` (object): Track which fields have been touched
- `isValidating` (boolean): Whether form is currently validating
- `isSubmitting` (boolean): Whether form is currently submitting

**Validation Rules**:
- `values` must match form field schema
- `errors` must be strings or null
- `touched` fields must correspond to actual form fields

## State Relationships

### UserSession ↔ TodoItem
- One UserSession can have many TodoItems
- TodoItems are filtered by `userId` to ensure data isolation
- When UserSession is cleared, all related TodoItems should be cleared

### UIState ↔ All Other Entities
- UIState provides loading and error states for operations on other entities
- UIState contains preferences that affect the presentation of other entities

## State Transitions

### UserSession Transitions
1. `initial` → `loading` (when authentication starts)
2. `loading` → `authenticated` (on successful authentication)
3. `loading` → `unauthenticated` (on failed authentication)
4. `authenticated` → `unauthenticated` (on logout or token expiration)

### TodoItem Transitions
1. `pending` → `saving` (when creating/updating)
2. `saving` → `saved` (on successful API response)
3. `saving` → `error` (on API failure)
4. `saved` → `editing` (when user starts editing)

### UIState Transitions
- Loading states follow the pattern: `false` → `true` → `false`
- Error states are added/removed based on operation outcomes
- Preferences are updated independently based on user actions

## Frontend-Specific Considerations

### Client-Side Validation
- All validation that can be performed client-side should be implemented
- Server responses should always override client-side validation
- User experience should be prioritized with immediate feedback

### Caching Strategy
- Todo lists should be cached to improve user experience
- Cache should be invalidated on data mutations
- Offline capability should be considered for future enhancement

### Security Considerations
- User data must only be accessible to authenticated users
- JWT tokens must be handled securely
- Sensitive data should not be stored in plain text in state