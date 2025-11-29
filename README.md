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
The backend server will run on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## Development Roadmap

See [GitHub Issues](https://github.com/mayamit/Simple_CRM_V1/issues) for the full development roadmap.

## License

MIT
