# Simple CRM V1

A simple Customer Relationship Management (CRM) system built with modern web technologies.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: SQLite

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript

## Project Structure

```
Simple_CRM_V1/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main Express server
│   │   ├── routes/           # API route definitions
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Business logic
│   │   ├── middleware/       # Custom middleware
│   │   └── config/           # Configuration files
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx          # Entry point
│   │   ├── App.tsx           # Root component
│   │   └── ...
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   ```

### Running the Application

#### Backend
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:5001`

#### Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## Authentication

The CRM uses JWT (JSON Web Tokens) for authentication with role-based access control.

### User Roles
- **ADMIN**: Full access to all features
- **USER**: Standard user access

### API Endpoints

#### Register a new user
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "USER"  // Optional: ADMIN or USER (defaults to USER)
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2025-11-29T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Access Protected Routes
Include the JWT token in the Authorization header:

```bash
GET /protected
Authorization: Bearer <your-jwt-token>
```

**Response (Success):**
```json
{
  "message": "This is a protected route",
  "user": {
    "userId": "uuid",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Response (No Token):**
```json
{
  "error": "No token provided"
}
```

### JWT Token Claims
The JWT token contains the following claims:
- `userId`: User's unique identifier
- `email`: User's email address
- `role`: User's role (ADMIN or USER)
- `iat`: Token issued at timestamp
- `exp`: Token expiration timestamp (default: 7 days)

### Environment Variables
Configure these in `backend/.env`:
```
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

## Development Roadmap

See [GitHub Issues](https://github.com/mayamit/Simple_CRM_V1/issues) for the full development roadmap.

## License

MIT
