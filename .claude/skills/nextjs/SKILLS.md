# Professional Frontend Skills for Phase II Full-Stack Todo Web Application

## 1. Next.js App Router & Project Architecture

**Skill Name:** Next.js App Router & Project Architecture
**Purpose:** To implement scalable, maintainable, and performant routing architecture that supports the complex navigation requirements of a full-stack todo application with authentication flows, dashboard views, and nested routes.
**Responsibilities:**
- Design hierarchical route structures supporting protected and public sections
- Implement dynamic routing for todo items and user-specific pages
- Configure middleware for authentication and authorization
- Establish project structure that separates concerns (components, services, models, utils)
- Optimize bundle splitting and code loading for performance
**What Problems It Solves in Phase II:**
- Enables clean separation between authenticated and public routes
- Supports SEO requirements for public-facing pages while maintaining secure user areas
- Facilitates team collaboration through standardized project structure
- Improves application performance through smart code splitting
**How It Connects with Backend Integration:**
- Defines API endpoints structure that aligns with route hierarchy
- Coordinates authentication state management across route boundaries
- Ensures proper error handling for API calls initiated from different routes
**Constraints:**
- Do NOT mix App Router with Pages Router in the same application
- Do NOT create deeply nested route structures that hurt performance
- Do NOT bypass middleware for authenticated routes

## 2. Auth-Protected Routing & Layouts

**Skill Name:** Auth-Protected Routing & Layouts
**Purpose:** To implement secure, role-based access control that protects user data while providing seamless navigation experiences for authenticated and unauthenticated users.
**Responsibilities:**
- Create higher-order components for route protection
- Implement authentication state management across the application
- Design layout hierarchies that maintain consistent UI while respecting access levels
- Handle authentication state persistence and token refresh mechanisms
- Manage redirects and access denial with appropriate user feedback
**What Problems It Solves in Phase II:**
- Prevents unauthorized access to sensitive user data and functionality
- Maintains consistent user experience across protected sections
- Implements secure session management without compromising UX
- Handles edge cases like token expiration and refresh seamlessly
**How It Connects with Backend Integration:**
- Coordinates with JWT-based authentication endpoints for token validation
- Implements automatic token refresh before expiration
- Handles 401/403 responses from backend with appropriate UI actions
- Manages logout procedures that clear both frontend and backend sessions
**Constraints:**
- Do NOT store sensitive authentication tokens in local storage without proper security measures
- Do NOT allow access to protected routes without proper validation
- Do NOT expose sensitive user data through route parameters without authorization

## 3. API Integration with JWT-based Authentication

**Skill Name:** API Integration with JWT-based Authentication
**Purpose:** To establish secure, reliable communication between frontend and backend services using industry-standard authentication protocols that protect user data and maintain session integrity.
**Responsibilities:**
- Implement secure JWT token storage, retrieval, and transmission
- Create API service layers that abstract authentication complexity
- Handle token refresh mechanisms and expiration scenarios
- Implement request/response interceptors for authentication headers
- Manage error handling for authentication failures and network issues
**What Problems It Solves in Phase II:**
- Ensures secure communication between frontend and backend
- Maintains user sessions across application restarts and network interruptions
- Handles token refresh transparently without disrupting user workflow
- Provides consistent error handling for authentication-related issues
**How It Connects with Backend Integration:**
- Coordinates with backend authentication endpoints for login, refresh, and logout
- Implements proper header configuration for authenticated requests
- Handles backend-specific authentication error responses
- Manages token lifecycle in sync with backend session management
**Constraints:**
- Do NOT transmit JWT tokens over non-HTTPS connections
- Do NOT store JWT tokens in plain text or easily accessible locations
- Do NOT bypass authentication checks for any API calls

## 4. Component-Driven UI Architecture with Tailwind CSS

**Skill Name:** Component-Driven UI Architecture with Tailwind CSS
**Purpose:** To create reusable, maintainable, and scalable user interface components that provide consistent user experience while enabling rapid feature development and visual coherence.
**Responsibilities:**
- Design atomic design system with reusable components (atoms, molecules, organisms)
- Implement responsive design patterns using Tailwind CSS utilities
- Create themeable UI components that support customization
- Establish consistent design patterns and accessibility standards
- Optimize component performance through proper rendering strategies
**What Problems It Solves in Phase II:**
- Reduces development time through component reusability
- Ensures consistent user experience across different application sections
- Enables rapid iteration on UI/UX designs
- Improves accessibility and responsive behavior across devices
**How It Connects with Backend Integration:**
- Creates data-bound components that properly display backend responses
- Implements loading and error states that reflect API integration status
- Designs components that adapt to different data structures from backend services
- Ensures UI patterns align with backend data validation and constraints
**Constraints:**
- Do NOT create overly complex components that violate single responsibility principle
- Do NOT hardcode business logic within presentation components
- Do NOT ignore accessibility standards and semantic HTML practices

## 5. Forms, Client State, Loading & Error Handling

**Skill Name:** Forms, Client State, Loading & Error Handling
**Purpose:** To implement robust user interaction patterns that provide immediate feedback, handle asynchronous operations gracefully, and maintain data integrity throughout the user journey.
**Responsibilities:**
- Create form validation systems that work both client-side and server-side
- Implement client state management for complex application states
- Design loading indicators and skeleton screens for perceived performance
- Handle error states with user-friendly messaging and recovery options
- Manage optimistic updates and data synchronization with backend
**What Problems It Solves in Phase II:**
- Provides smooth user experience during API calls and data operations
- Prevents data loss during network interruptions or failures
- Maintains application stability during concurrent operations
- Guides users effectively through error scenarios with clear recovery paths
**How It Connects with Backend Integration:**
- Maps backend validation errors to appropriate form field feedback
- Implements proper loading states that reflect API operation status
- Handles various HTTP error codes with appropriate UI responses
- Manages data synchronization between client state and backend updates
**Constraints:**
- Do NOT submit forms without proper validation and user feedback
- Do NOT display raw error messages from backend to end users
- Do NOT allow inconsistent states between client and backend data