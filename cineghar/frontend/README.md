# Cineghar Web

A Next.js application with component separation and Zod validation for forms.

## Pages

1. `/` or `/home` - Home Page (dummy for now)
2. `/login` - Login Page with form validation
3. `/register` - Register Page with form validation
4. `/auth/dashboard` - Dashboard page (dummy for now)

## Features

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS for styling
- Zod for form validation
- React Hook Form for form management
- Component separation
- Reusable FormInput component

## Getting Started (Monorepo)

1. Install dependencies (from `cineghar/` monorepo root):
```bash
cd cineghar
npm install
```

2. Run the frontend (Next.js) dev server (from `cineghar/`):
```bash
npm run dev:frontend
```

3. Run the backend API dev server (from `cineghar/`):
```bash
npm run dev:backend
```

4. Or run both frontend and backend together (from `cineghar/`):
```bash
npm run dev:all
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the project root (for the frontend):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5050
```

The backend already reads its own environment from `backend/.env` (see backend README).

## Scripts (from `cineghar/` root)

- `npm run dev:frontend` - Start Next.js development server
- `npm run dev:backend` - Start backend dev server
- `npm run dev:all` - Start both frontend and backend in parallel
- `npm run build:frontend` - Build the Next.js app
- `npm run build:backend` - Build the backend
- `npm run build:all` - Build both frontend and backend
- `npm run start:frontend` - Start the Next.js production server
- `npm run start:backend` - Start the backend production server

## Project Structure (inside `cineghar/`)

- `frontend/app/` - Next.js app directory with pages and components
- `backend/` - Express backend API
- `frontend/contexts/` - React context providers
- `frontend/utils/` - Utility functions and constants
- `frontend/public/` - Static assets

## Technologies Used

- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Utility-first CSS framework
- Zod - Schema validation
- React Hook Form - Form state management

