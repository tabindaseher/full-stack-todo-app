# Todo Frontend Application

This is the frontend for the Todo application built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

Create a `.env.local` file in the root of the `frontend` directory with the following:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Features

- User authentication (login/register)
- Todo management (create, read, update, delete)
- Filtering and sorting of todos
- Responsive design for mobile and desktop
- Dark/light theme support
- Loading and error states

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Base UI components (buttons, inputs, etc.)
│   │   ├── layout/    # Layout components (header, etc.)
│   │   └── features/  # Feature-specific components
│   ├── pages/        # Next.js pages (routes)
│   ├── services/     # API services and authentication
│   ├── hooks/        # Custom React hooks
│   ├── context/      # React Context providers
│   ├── utils/        # Utility functions
│   └── styles/       # Global styles and Tailwind config
├── public/           # Static assets
├── package.json
└── next.config.js    # Next.js configuration
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Tailwind CSS](https://tailwindcss.com/docs) - rapidly build modern websites without writing CSS.