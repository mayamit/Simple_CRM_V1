# Simple CRM V1

A modern, full-stack Customer Relationship Management (CRM) system with role-based access control, customer management, activity tracking, and a beautiful 2026-ready UI.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Demo Flow](#demo-flow)
- [Troubleshooting](#troubleshooting)
- [Development Roadmap](#development-roadmap)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                   (React + Vite + TypeScript)                   │
│                    http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │ JWT Authentication
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Backend Server                             │
│                  (Express + TypeScript)                         │
│                    http://localhost:5001                        │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │   Routes    │─▶│ Controllers  │─▶│   Middleware     │      │
│  │             │  │              │  │  (Auth, RBAC)    │      │
│  └─────────────┘  └──────┬───────┘  └──────────────────┘      │
│                           │                                     │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │  Prisma ORM     │                           │
│                  │                 │                           │
│                  └────────┬────────┘                           │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      SQLite Database                            │
│                   (dev.db - local file)                         │
│                                                                 │
│  Tables: User, Customer, Note                                  │
└─────────────────────────────────────────────────────────────────┘

Key Data Flow:
1. User logs in via React frontend
2. Backend validates credentials, returns JWT token
3. Frontend stores token in localStorage
4. All API requests include JWT token in Authorization header
5. Backend middleware validates token and extracts user info
6. Controllers enforce role-based access control (ADMIN vs USER)
7. Prisma ORM queries SQLite database
8. Results returned to frontend for display
```

---

## Tech Stack

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | v18+ |
| **TypeScript** | Type-safe JavaScript | ^5.x |
| **Express** | Web framework | ^4.18 |
| **Prisma** | ORM & database toolkit | ^5.x |
| **SQLite** | Embedded database | 3.x |
| **bcryptjs** | Password hashing | ^2.4 |
| **jsonwebtoken** | JWT authentication | ^9.0 |
| **cors** | CORS middleware | ^2.8 |

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI library | ^18.2 |
| **TypeScript** | Type-safe JavaScript | ^5.x |
| **Vite** | Build tool & dev server | ^5.x |
| **React Router** | Client-side routing | ^6.x |

---

## Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (ADMIN / USER)
- ✅ Secure password hashing with bcrypt
- ✅ 7-day token expiration
- ✅ Protected routes with middleware

### Customer Management
- ✅ Create, Read, Update, Delete (CRUD) customers
- ✅ Customer status workflow: Lead → Prospect → Active → Inactive
- ✅ Customer assignment to users
- ✅ Search customers by name, email, or company
- ✅ Filter customers by status
- ✅ Role-based visibility (Users see only assigned customers, Admins see all)

### Activity Tracking
- ✅ Add notes to customer records
- ✅ Activity timeline with timestamps
- ✅ Track who created each note

### Dashboard & Analytics
- ✅ Total customer count
- ✅ Customers grouped by status
- ✅ Activities in last 7 days
- ✅ Role-specific metrics

### Modern UI (2026 Design)
- ✅ Modern gradient color scheme (indigo/purple primary)
- ✅ Responsive card-based layouts
- ✅ SVG icons throughout
- ✅ Smooth animations and transitions
- ✅ Status badges with color coding
- ✅ Modal overlays with glassmorphism
- ✅ Loading states with spinners

---

## Project Structure

```
Simple_CRM_V1/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Main Express server
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # /auth endpoints (login, register)
│   │   │   ├── customerRoutes.ts    # /customers endpoints (CRUD)
│   │   │   ├── noteRoutes.ts        # /notes endpoints
│   │   │   └── dashboardRoutes.ts   # /dashboard endpoints
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Auth logic (login, register)
│   │   │   ├── customerController.ts # Customer CRUD logic
│   │   │   ├── noteController.ts    # Note management logic
│   │   │   └── dashboardController.ts # Dashboard KPIs
│   │   └── middleware/
│   │       └── authMiddleware.ts    # JWT validation & RBAC
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── seed.ts                  # Database seeding script
│   │   └── dev.db                   # SQLite database file (gitignored)
│   ├── .env                         # Environment variables (gitignored)
│   ├── .env.example                 # Example environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # Entry point
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── App.css                  # Global styles & design system
│   │   ├── api/
│   │   │   └── client.ts            # API client with JWT handling
│   │   └── pages/
│   │       ├── Login.tsx            # Login page
│   │       ├── Dashboard.tsx        # Dashboard with KPIs
│   │       ├── CustomerList.tsx     # Customer list with search/filter
│   │       └── CustomerDetail.tsx   # Customer detail with notes
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md                        # This file
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mayamit/Simple_CRM_V1.git
   cd Simple_CRM_V1
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `backend/.env` if needed (default values work for development):
   ```env
   PORT=5001
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Initialize the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init

   # Seed the database with test users
   npx prisma db seed
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
✅ Backend running at: **http://localhost:5001**

#### Start Frontend Development Server
Open a new terminal:
```bash
cd frontend
npm run dev
```
✅ Frontend running at: **http://localhost:3000**

### Test Users (Seeded)

After running `npx prisma db seed`, you'll have these test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **ADMIN** | admin@crm.com | admin123 | Full access to all features |
| **USER** | user@crm.com | user123 | Limited to assigned customers |

---

## Database Schema

### User Table
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  role      String   @default("USER") // "ADMIN" or "USER"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  customers Customer[] // Customers assigned to this user
  notes     Note[]     // Notes created by this user
}
```

### Customer Table
```prisma
model Customer {
  id               String   @id @default(uuid())
  name             String
  email            String   @unique
  phone            String?
  company          String?
  status           String   @default("Lead") // "Lead", "Prospect", "Active", "Inactive"
  assignedToUserId String?
  isDeleted        Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  assignedToUser User?  @relation(fields: [assignedToUserId], references: [id])
  notes          Note[]
}
```

### Note Table
```prisma
model Note {
  id            String   @id @default(uuid())
  content       String
  customerId    String
  createdByUserId String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  customer      Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  createdByUser User     @relation(fields: [createdByUserId], references: [id])
}
```

---

## Authentication & Authorization

### JWT Token Flow
1. User logs in with email/password
2. Backend validates credentials
3. Backend generates JWT token containing:
   - `userId`: User's UUID
   - `email`: User's email
   - `role`: User's role (ADMIN or USER)
   - `exp`: Expiration timestamp (7 days)
4. Frontend stores token in `localStorage`
5. All API requests include token in `Authorization: Bearer <token>` header
6. Backend middleware validates token and attaches user info to request

### Role-Based Access Control (RBAC)

| Feature | ADMIN | USER |
|---------|-------|------|
| View all customers | ✅ | ❌ (only assigned) |
| View dashboard (all data) | ✅ | ❌ (only assigned) |
| Create customer | ✅ | ✅ |
| Update customer | ✅ | ✅ (if assigned) |
| Delete customer | ✅ | ✅ (if assigned) |
| Assign customer to user | ✅ | ❌ |
| Add notes | ✅ | ✅ |
| View notes | ✅ | ✅ |

---

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass123",
  "role": "USER"  // Optional: "ADMIN" or "USER"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@crm.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@crm.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Customer Routes

#### Get Customers (with search & filter)
```http
GET /customers?search=john&status=Active&limit=50&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `search`: Search in name, email, company (optional)
- `status`: Filter by status: Lead, Prospect, Active, Inactive (optional)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "customers": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@company.com",
      "phone": "+1-555-0100",
      "company": "Acme Inc.",
      "status": "Active",
      "assignedToUser": {
        "id": "uuid",
        "name": "Admin User",
        "email": "admin@crm.com"
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:45:00Z"
    }
  ],
  "total": 1
}
```

#### Get Customer by ID
```http
GET /customers/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "customer": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+1-555-0100",
    "company": "Acme Inc.",
    "status": "Active",
    "assignedToUser": { ... },
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-20T14:45:00Z"
  }
}
```

#### Create Customer
```http
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "+1-555-0100",
  "company": "Acme Inc.",
  "status": "Lead"
}
```

#### Update Customer
```http
PUT /customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "status": "Active",
  "phone": "+1-555-0101"
}
```

#### Delete Customer (Soft Delete)
```http
DELETE /customers/:id
Authorization: Bearer <token>
```

#### Assign Customer (ADMIN only)
```http
POST /customers/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedToUserId": "user-uuid"
}
```

### Note Routes

#### Get Notes for Customer
```http
GET /notes/customer/:customerId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "notes": [
    {
      "id": "uuid",
      "content": "Follow-up call scheduled for next week.",
      "customerId": "customer-uuid",
      "createdByUser": {
        "id": "user-uuid",
        "name": "Admin User",
        "email": "admin@crm.com"
      },
      "createdAt": "2025-01-20T15:30:00Z"
    }
  ]
}
```

#### Create Note
```http
POST /notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer-uuid",
  "content": "Customer interested in premium plan."
}
```

### Dashboard Routes

#### Get Dashboard Summary
```http
GET /dashboard/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalCustomers": 45,
  "customersByStatus": {
    "Lead": 12,
    "Prospect": 15,
    "Active": 16,
    "Inactive": 2
  },
  "activitiesLast7Days": 23
}
```

---

## Demo Flow

Follow these steps to explore the CRM functionality:

### 1. Login as Admin
1. Navigate to **http://localhost:3000**
2. Use admin credentials:
   - Email: `admin@crm.com`
   - Password: `admin123`
3. Click **Sign In**

### 2. View Dashboard
- See total customer count
- View customers grouped by status (Lead, Prospect, Active, Inactive)
- Check activities in the last 7 days
- Notice the modern gradient cards and visual design

### 3. Navigate to Customers
1. Click **View Customers** button
2. You'll see the customer list page with:
   - Search bar (search by name, email, company)
   - Status filter dropdown
   - Customer table with status badges

### 4. Create a New Customer
1. Click **Create Customer** button
2. Fill in the form:
   - Name: "Sarah Johnson"
   - Email: "sarah@techcorp.com"
   - Phone: "+1-555-0200"
   - Company: "TechCorp"
   - Status: "Lead"
3. Click **Create Customer**
4. New customer appears in the list

### 5. View Customer Details
1. Click **View Details** on any customer
2. You'll see:
   - Customer information card
   - Edit and Delete buttons
   - Notes & Activities section

### 6. Add Notes to Customer
1. Scroll to "Add New Note" section
2. Enter note content: "Initial contact made. Very interested in our services."
3. Click **Add Note**
4. Note appears in the history with your name and timestamp

### 7. Edit Customer
1. Click **Edit** button
2. Change status from "Lead" to "Prospect"
3. Update phone number
4. Click **Save Changes**
5. Customer details update immediately

### 8. Use Search & Filter
1. Go back to **Customers** page
2. Try searching for "Sarah"
3. Try filtering by status "Prospect"
4. Notice how the list updates in real-time

### 9. Test Role-Based Access (Optional)
1. Logout (click **Logout** button)
2. Login as regular user:
   - Email: `user@crm.com`
   - Password: `user123`
3. Notice:
   - Dashboard shows only assigned customers
   - Customer list shows only assigned customers
   - No "Assign Customer" functionality (admin-only)

### 10. Admin-Only: Assign Customer
1. Login as admin again
2. Create a new customer or select existing
3. Use API endpoint to assign customer to user:
   ```bash
   curl -X POST http://localhost:5001/customers/{customerId}/assign \
     -H "Authorization: Bearer {admin-token}" \
     -H "Content-Type: application/json" \
     -d '{"assignedToUserId": "{userId}"}'
   ```
4. Now the regular user can see this customer when they log in

---

## Troubleshooting

### Backend won't start

**Error: Port 5001 already in use**
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change the port in backend/.env
PORT=5002
```

**Error: Prisma Client not generated**
```bash
cd backend
npx prisma generate
```

**Error: Database not found**
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### Frontend won't start

**Error: Port 3000 already in use**
```bash
# The dev server will automatically try port 3001, 3002, etc.
# Or manually set the port in vite.config.ts
```

**Error: Cannot connect to backend**
- Ensure backend is running on port 5001
- Check `frontend/vite.config.ts` proxy configuration
- Check CORS is enabled in backend

### Authentication Issues

**Error: Invalid token**
- Token might be expired (7-day expiration)
- Clear localStorage and login again
- Check JWT_SECRET matches between sessions

**Error: 403 Forbidden**
- You don't have permission for this action
- Check if you're logged in as the correct role (ADMIN vs USER)
- Some endpoints require ADMIN role

### Database Issues

**Reset database completely**
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
npx prisma db seed
```

**View database contents**
```bash
cd backend
npx prisma studio
# Opens GUI at http://localhost:5555
```

---

## Development Roadmap

### Completed Features ✅
- [x] CRM-01: JWT Authentication with RBAC
- [x] CRM-02: Customer Master CRUD APIs
- [x] CRM-03: Notes & Activity Log
- [x] CRM-04: Dashboard KPIs
- [x] CRM-05: Customer Assignment Workflow
- [x] CRM-06: Search & Filter
- [x] CRM-07: React Frontend with Modern UI
- [x] CRM-08: Documentation & Developer Onboarding

### Future Enhancements 🚀
- [ ] Email notifications
- [ ] Export data to CSV/Excel
- [ ] Advanced reporting & analytics
- [ ] Calendar integration
- [ ] File attachments for customers
- [ ] Activity reminders & tasks
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit & integration tests
- [ ] Docker containerization
- [ ] Production deployment guide

See [GitHub Issues](https://github.com/mayamit/Simple_CRM_V1/issues) for detailed roadmap.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - feel free to use this project for learning or commercial purposes.

---

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/mayamit/Simple_CRM_V1/issues)
- Email: [Your contact email]

---

**Built with ❤️ using modern web technologies**
