# LTI Candidate Management System

A full-stack application for managing candidates in a recruitment process.

## Features

- Dashboard with key statistics
- Candidate management (add, edit, delete)
- CV file upload and download
- Filtering and searching candidates
- Status tracking (Pending, Valuated, Discarded)
- Responsive design

## Tech Stack

### Frontend

- React with JavaScript
- shadcn/ui components
- Responsive design with Tailwind CSS

### Backend

- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- Domain-Driven Design architecture

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)
- Docker (optional, for containerized database)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd AI4Devs-lab-ides
```

### 2. Install dependencies

```bash
npm run install:all
```

This will install dependencies for the root project, backend, and frontend.

### 3. Set up the database

Make sure PostgreSQL is running. You can use the included Docker Compose file:

```bash
docker-compose up -d
```

### 4. Configure environment variables

The backend uses environment variables for configuration. A sample `.env` file is provided in the backend directory.

```bash
# Navigate to backend directory
cd backend

# Copy the sample .env file
cp .env.example .env

# Edit the .env file with your database credentials
```

### 5. Run database migrations

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 6. Start the application

From the root directory:

```bash
npm start
```

This will start both the backend and frontend servers:

- Backend: http://localhost:3010
- Frontend: http://localhost:3000

## Project Structure

```
.
├── backend/                # Backend application
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/                # Source code
│   │   ├── application/    # Application services
│   │   ├── domain/         # Domain entities and interfaces
│   │   ├── infrastructure/ # Infrastructure implementations
│   │   └── presentation/   # API controllers and routes
│   └── uploads/            # Uploaded files storage
│
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   └── src/                # Source code
│       ├── components/     # React components
│       ├── lib/            # Utilities and services
│       └── App.js          # Main application component
│
└── docker-compose.yml      # Docker Compose configuration
```

## API Endpoints

- `GET /api/candidates` - List all candidates
- `GET /api/candidates/:id` - Get a specific candidate
- `POST /api/candidates` - Create a new candidate
- `PUT /api/candidates/:id` - Update a candidate
- `DELETE /api/candidates/:id` - Delete a candidate
- `GET /api/candidates/:id/cv` - Download a candidate's CV
- `GET /api/statistics` - Get dashboard statistics
- `GET /api/suggestions/education` - Get education suggestions

## Development

### Running tests

```bash
npm test
```

### Building for production

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
