# CineGhar Backend API

Backend API for CineGhar application with user authentication and admin management features.

## Features

- ✅ User Registration with Zod DTO validation
- ✅ User Login with JWT token generation
- ✅ Password hashing using bcryptjs
- ✅ JWT-based authentication
- ✅ Admin role-based access control
- ✅ Admin user management (CRUD operations)
- ✅ Unique email validation
- ✅ Clean architecture with separation of concerns

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

## Project Structure

```
backend/
├── src/
│   ├── configs/          # Configuration files
│   ├── controllers/      # Request handlers
│   │   └── admin/        # Admin controllers
│   ├── database/         # Database connection
│   ├── dtos/             # Data Transfer Objects (Zod schemas)
│   ├── errors/           # Custom error classes
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── repositories/     # Data access layer
│   ├── routes/           # API routes
│   │   └── admin/        # Admin routes
│   ├── services/         # Business logic
│   │   └── admin/        # Admin services
│   ├── types/            # TypeScript types
│   └── index.ts          # Application entry point
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── POSTMAN_TESTING.md    # Postman testing guide
```

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the backend directory:
```env
PORT=5050
MONGODB_URI=mongodb://localhost:27017/cineghar
JWT_SECRET=your-secret-key-here

# Optional: Nodemailer / SMTP (for forgot-password emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=noreply@example.com
FRONTEND_URL=http://localhost:3000
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5050`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body:** `{ name, email, password, confirmPassword, dateOfBirth? }`
- **Response:** User object (without password) + success message

#### Login User
- **POST** `/api/auth/login`
- **Body:** `{ email, password }`
- **Response:** User object + JWT token

#### Get User by ID
- **GET** `/api/auth/:id`
- **Response:** User object

#### Get All Users
- **GET** `/api/auth`
- **Response:** Array of user objects

#### Update User
- **PUT** `/api/auth/:id`
- **Body:** `{ name?, email?, dateOfBirth? }`
- **Response:** Updated user object

#### Delete User
- **DELETE** `/api/auth/:id`
- **Response:** Success message

### Admin Routes (`/api/admin/auth`)

All admin routes require:
1. Valid JWT token in `Authorization: Bearer <token>` header
2. User must have `role: "admin"`

#### Test Route
- **GET** `/api/admin/auth/test`
- **Response:** Welcome message

#### Create Admin User
- **POST** `/api/admin/auth`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:** `{ name, email, password, confirmPassword, dateOfBirth? }`
- **Response:** Created admin user object

#### Get All Users
- **GET** `/api/admin/auth`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:** Array of all users

#### Get User by ID
- **GET** `/api/admin/auth/:id`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:** User object

#### Update User
- **PUT** `/api/admin/auth/:id`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:** `{ name?, email?, dateOfBirth? }`
- **Response:** Updated user object

#### Delete User
- **DELETE** `/api/admin/auth/:id`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:** Success message

## User Model

```typescript
{
  name: string;
  email: string;        // Unique, validated
  password: string;     // Hashed with bcryptjs
  dateOfBirth?: string;
  role: "user" | "admin";  // Default: "user"
  createdAt: Date;
  updatedAt: Date;
}
```

## DTOs (Data Transfer Objects)

### Register User DTO
- Validates: name (min 2 chars), email (valid format), password (min 6 chars), confirmPassword match
- Ensures unique email in database

### Login User DTO
- Validates: email (valid format), password (min 6 chars)

### Update User DTO
- All fields optional
- Validates: name, email, dateOfBirth

## Authentication Flow

1. **Registration:**
   - Validate request body with Zod DTO
   - Check for duplicate email
   - Hash password with bcryptjs
   - Create user with role "user" by default
   - Return user object (password excluded)

2. **Login:**
   - Validate request body with Zod DTO
   - Find user by email
   - Compare password with bcryptjs
   - Generate JWT token (expires in 30 days)
   - Return user object + token

3. **Protected Routes:**
   - Extract token from `Authorization` header
   - Verify token with JWT_SECRET
   - Attach user to request object
   - For admin routes: verify user role is "admin"

## Testing

See [POSTMAN_TESTING.md](./POSTMAN_TESTING.md) for comprehensive Postman testing guide.

### Quick Test Commands

```bash
# Register a user
curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5050` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/cineghar` |
| `JWT_SECRET` | Secret key for JWT tokens | `cineghar-secret-key` |

## Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ Password never returned in responses
- ✅ Unique email enforcement

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Architecture

The project follows clean architecture principles:

1. **Routes** - Define API endpoints
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Business logic
4. **Repositories** - Data access layer
5. **Models** - Database schemas
6. **DTOs** - Request validation
7. **Middlewares** - Authentication & authorization

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly with Postman
4. Submit a pull request

## License

ISC




