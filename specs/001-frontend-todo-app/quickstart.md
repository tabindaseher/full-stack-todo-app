# Quickstart: Frontend Todo Application

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A running backend API with JWT authentication

## Setup Instructions

### 1. Clone and Initialize
```bash
# Navigate to project directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Configuration
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local with your API configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
```

### 3. Run Development Server
```bash
# Start development server
npm run dev
# or
yarn dev

# Application will be available at http://localhost:3000
```

## Key Features Overview

### Authentication Flow
1. User visits `/login` page
2. User enters credentials
3. JWT token is stored securely
4. User redirected to `/dashboard`
5. Token automatically included in API requests

### Todo Management
1. Dashboard shows all user's todos
2. Create new todos with title, description, priority
3. Mark todos as complete/incomplete
4. Filter and sort todos
5. Edit or delete existing todos

### Responsive Design
- Mobile: Single column layout, touch-friendly controls
- Tablet: Two column layout with sidebar navigation
- Desktop: Multi-column layout with advanced filtering

## API Integration

The application uses `/lib/api.ts` for all backend communication:

```typescript
// Example API call
import { api } from '@/lib/api';

// Get user's todos
const todos = await api.get('/todos');

// Create a new todo
const newTodo = await api.post('/todos', { title: 'New task' });

// Update a todo
const updatedTodo = await api.put('/todos/123', { completed: true });

// Delete a todo
await api.delete('/todos/123');
```

## Running Tests

```bash
# Run unit tests
npm run test
# or
yarn test

# Run integration tests
npm run test:integration
# or
yarn test:integration

# Run end-to-end tests
npm run test:e2e
# or
yarn test:e2e
```

## Build for Production

```bash
# Build the application
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## Common Tasks

### Adding a New Component
1. Create component in `components/` directory
2. Follow naming convention: `ComponentName.tsx`
3. Use TypeScript interfaces for props
4. Include proper Tailwind classes for responsiveness
5. Add Framer Motion animations where appropriate

### Adding a New Page
1. Create page in `app/` directory following App Router conventions
2. Add proper metadata for SEO
3. Implement responsive layout
4. Include loading states and error boundaries
5. Connect to API using `/lib/api.ts`

### Adding New Styling
1. Use Tailwind utility classes
2. Create reusable components for common patterns
3. Follow the design system in `tailwind.config.js`
4. Ensure all components are responsive
5. Test accessibility compliance