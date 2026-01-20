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

## Getting Started

1. Install dependencies:
```bash
npm install
cd backend && npm install
cd ..
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Start the backend API server (in another terminal):
```bash
cd backend
npm run dev
```

## Environment Variables

Create a `.env.local` file in the project root (for the frontend):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5050
```

The backend already reads its own environment from `backend/.env` (see backend README).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

- `app/` - Next.js app directory with pages and components
- `contexts/` - React context providers
- `utils/` - Utility functions and constants
- `public/` - Static assets

## Technologies Used

- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Utility-first CSS framework
- Zod - Schema validation
- React Hook Form - Form state management

