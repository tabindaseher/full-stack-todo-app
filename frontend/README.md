# Frontend Todo Application

A modern, responsive todo application built with Next.js 16+, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication**: JWT-based authentication with login/register
- **Todo Management**: Create, read, update, and delete todos
- **Filtering & Sorting**: Filter by status, priority, and search; sort by date or priority
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Animations**: Smooth transitions and interactions with Framer Motion
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.3+
- **Animations**: Framer Motion 10+
- **Data Fetching**: SWR
- **Testing**: Jest, React Testing Library, Cypress

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the frontend directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── dashboard/          # Dashboard page
├── components/            # Reusable UI components
│   ├── ui/                # Basic UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── animations/        # Animation components
├── lib/                   # Utility functions and API client
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── styles/                # Global styles
```

## API Integration

The application integrates with a backend API via the `/lib/api.ts` file. All API calls include JWT authentication tokens automatically.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API (default: http://localhost:3001/api)

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run unit tests
- `npm run test:e2e`: Run end-to-end tests

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)