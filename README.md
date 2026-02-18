# Cineghar Web

A Next.js monorepo application with Express backend, component separation, and Zod validation for forms.

## Project Structure (Monorepo)

```
cineghar-web/
├── app/                    # Next.js frontend application
├── packages/
│   └── backend/            # Express backend API
├── api/                   # Vercel serverless functions
└── vercel.json           # Vercel deployment configuration
```

## Pages

1. `/` or `/home` - Home Page
2. `/login` - Login Page with form validation
3. `/register` - Register Page with form validation
4. `/auth/dashboard` - Dashboard page

## Features

- Next.js 16 with App Router
- Express backend API
- Monorepo structure with npm workspaces
- TypeScript
- Tailwind CSS for styling
- Zod for form validation
- React Hook Form for form management
- Vercel-ready deployment

## Getting Started

1. Install dependencies (installs both frontend and backend):
```bash
npm install
```

2. Run both frontend and backend together:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Frontend only
npm run dev

# Backend only (in another terminal)
npm run dev:backend
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Backend API runs on [http://localhost:5050](http://localhost:5050)

## Environment Variables

### Frontend (.env.local in root)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5050
```

### Backend (packages/backend/.env)
```bash
PORT=5050
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM="CineGhar <your_email@gmail.com>"
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:backend` - Start backend development server
- `npm run dev:all` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm run build:backend` - Build backend for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Vercel Deployment

This project is configured as a monorepo for Vercel deployment.

### Deployment Steps:

1. **Push to GitHub/GitLab/Bitbucket**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables in Vercel:**
   - Add all backend environment variables from `packages/backend/.env`
   - Add frontend variables:
     - `NEXT_PUBLIC_API_BASE_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - Update `FRONTEND_URL` to your Vercel URL

4. **Deploy:**
   - Vercel will automatically build and deploy
   - Backend API routes are available at `/api/*`
   - Frontend is served at the root

### Important Notes:
- Backend Express routes are wrapped as Vercel serverless functions in `api/[...path].ts`
- All API routes (`/api/auth/*`, `/api/admin/*`) will be handled by the Express backend
- Make sure to set all environment variables in Vercel dashboard

## Technologies Used

- Next.js 16 - React framework
- TypeScript - Type safety
- Tailwind CSS - Utility-first CSS framework
- Zod - Schema validation
- React Hook Form - Form state management

