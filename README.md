# Cineghar Monorepo

This repository contains the Cineghar **monorepo** inside the `cineghar/` directory, with separate `frontend` and `backend` projects.

## Structure

- `cineghar/frontend` – Next.js app (web frontend)
- `cineghar/backend` – Express + MongoDB API (backend)

## Getting Started

From the `cineghar/` directory:

```bash
cd cineghar
npm install
```

Run development servers:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Both together
npm run dev:all
```

See `cineghar/frontend/README.md` and `cineghar/backend/README.md` for more detailed app-specific docs.

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

1. Install dependencies (root + backend workspace):
```bash
npm install
```

2. Run the frontend (Next.js) dev server:
```bash
npm run dev
```

3. Run the backend API dev server:
```bash
npm run dev:backend
```

4. Or run both frontend and backend together:
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

## Scripts (root)

- `npm run dev` - Start Next.js development server
- `npm run dev:backend` - Start backend dev server (`backend` workspace)
- `npm run dev:all` - Start both frontend and backend in parallel
- `npm run build` - Build the Next.js app
- `npm run build:backend` - Build the backend (`backend` workspace)
- `npm run build:all` - Build both frontend and backend
- `npm run start` - Start the Next.js production server
- `npm run start:backend` - Start the backend production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

- `app/` - Next.js app directory with pages and components
- `backend/` - Express backend API
- `contexts/` - React context providers
- `utils/` - Utility functions and constants
- `public/` - Static assets

## Technologies Used

- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Utility-first CSS framework
- Zod - Schema validation
- React Hook Form - Form state management

