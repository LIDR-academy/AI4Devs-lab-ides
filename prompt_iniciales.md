# Recruitment Application - Candidate Management System

# Role

You are a Senior Software Engineer with expertise in Node.js, Express, Prisma, and React. You have strong skills in TypeScript, database development, and full-stack application architecture. You follow best practices including TDD (Test-Driven Development), DDD (Domain-Driven Design), SOLID principles, and OWASP security guidelines.

Your goal is to provide clean, scalable, and secure solutions, following modern software development methodologies. You prioritize efficiency, maintainability, and best practices in coding, database design, and API development. You also ensure that frontend and backend components communicate seamlessly, with a focus on performance, security, and developer experience.

## Project Overview

This project implements a full-stack Candidate Management System for LTI - Recruiting Talent Tracking. The application allows recruiters to add, view, edit, and manage candidates throughout the recruitment process. The primary users of the system will be recruiters who need to enter, track, and evaluate candidate information efficiently in a single platform.

**As a** recruiter,  
**I want** to have the ability to add candidates to the ATS system,  
**So that** I can efficiently manage their data and selection processes.

## Technical Specifications

### Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Validation**: Zod for schema validation
- **UI Components**: shadcn/ui
- **Testing**: Jest

### Data Model

```prisma
model Candidate {
	id         Int      @id @default(autoincrement())
	firstName  String
	lastName   String
	email      String   @unique
	phone      String?
	address    String   @db.VarChar(100)
	education  String   @db.Text
	experience String   @db.Text
	cvFilePath String?  // Stores the path to the uploaded CV file
	status     Status   @default(PENDING)
	createdAt  DateTime @default(now())
	updatedAt  DateTime @updatedAt
}

enum Status {
	PENDING
	VALUATED
	DISCARDED
}
```

## Backend Requirements

The backend follows Domain-Driven Design (DDD) and Hexagonal Architecture principles as outlined in `backend/CONTRIBUTING.md`.

### API Endpoints

1. **Create Candidate**

   - `POST /api/candidates`
   - Accepts multipart/form-data with candidate info and CV file
   - Validates data using Zod
   - Securely stores CV and candidate data

2. **List Candidates**

   - `GET /api/candidates`
   - Optional filtering parameters
   - Support for sorting and pagination
   - sord by id DESC

3. **Get Candidate**

   - `GET /api/candidates/:id`

4. **Update Candidate**

   - `PUT /api/candidates/:id`
   - Validates updated information

5. **Delete Candidate**

   - `DELETE /api/candidates/:id`
   - Removes record and associated CV file

6. **Download CV**

   - `GET /api/candidates/:id/cv`
   - Securely serves candidate's CV file

7. **Get Dashboard Statistics**
   - `GET /api/statistics`
   - Returns counts of total, pending, and valuated candidates

### Validation Requirements

- **Email**: Valid format
- **Phone**: Optional field
- **Address**: Max 100 characters
- **Education**: Text area input
- **Experience**: Text area input
- **Status**: PENDING, VALUATED, or DISCARDED
- **Required Fields**: firstName, lastName, email, address, education, experience
- **CV File**: PDF or DOCX format only

### File Storage

- Store files in `/upload` folder with secure naming
- Validate file format and content
- Implement error handling for file operations

## Frontend Requirements

The frontend follows the component design principles and React best practices outlined in `frontend/CONTRIBUTING.md`.

### UI Design Specifications

#### Color Palette

- **Primary color**: #0f172a
- **Secondary color**: #4f46e5
- **Background color**: white
- **Status indicators**:
  - PENDING: #f59e0b (amber/orange)
  - VALUATED: #10b981 (green)
  - DISCARDED: #ef4444 (red)

#### Layout Components

- Main layout shell with shadcn/ui components
- Responsive sidebar navigation
- Consistent header and footer
- Content organization with cards
- Skeleton loading states for async operations
- Page templates for dashboard, lists, forms, and details
- add Candidate has to open a popup that contains the form for insert the candicate
- search has to be on the header on the right side
- header e footer with the same color #ccc
- Dashboard has to have
  - Candidates received today
  - Total Candidates
  - Total Candidates
  - Valuated Candidates

### Dashboard View

- Display summary statistics at the top of the main view:
  - Total number of candidates
  - Number of pending candidates
  - Number of valuated candidates
  - Number of discarded candidates
- Statistics should be displayed in card format with clear visual distinction
- Cards should include both numbers and labels
- Implementation note: Statistics should be fetched from the backend but also maintained and updated locally when operations are performed

### Wireframes

```
+---------------------------------------------------+
| Dashboard   Candidates   Settings    [Search...]  |
+---------------------------------------------------+
|                                                   |
|  +-------------+  +-------------+  +-------------+|
|  | Total       |  | Pending     |  | Valuated    ||
|  | Candidates  |  | Candidates  |  | Candidates  ||
|  |             |  |             |  |             ||
|  |    125      |  |     42      |  |     83      ||
|  +-------------+  +-------------+  +-------------+|
|                                                   |
|  [Add Candidate] [Filter]                         |
|                                                   |
|  +-------------------------------------------+    |
|  | Name          | Email       | Status  | Actions|
|  +-------------------------------------------+    |
|  | John Smith    | js@mail.com | PENDING | [···] |
|  | Maria García  | mg@mail.com | VALUATED| [···] |
|  | Alex Johnson  | aj@mail.com | PENDING | [···] |
|  +-------------------------------------------+    |
|                                                   |
+---------------------------------------------------+
|                [Footer Information]               |
+---------------------------------------------------+

```

### Candidate Form

- Clean, organized layout with labeled sections
- Form fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, with validation)
  - Phone (optional)
  - Address (required, max 100 chars)
  - Education (required, textarea with autocompletion)
  - Experience (required, textarea with autocompletion)
  - CV Upload (PDF/DOCX only)
- **Dynamic Autocompletion System**:
  - Education and Experience fields must offer autocompletion suggestions based on existing data in the system
  - Backend needs to provide API endpoints to retrieve previously stored education/experience values
  - Suggestions should update dynamically as more candidates are added to the database
  - Implementation requires:
    - Backend: Endpoints to fetch unique education/experience values from existing candidates
    - Frontend: Autocomplete component that queries these endpoints as user types
    - Caching: Consider caching common suggestions for performance
  - The system should prioritize frequently used terms in suggestions
- Form buttons:
  - Submit (primary action)
  - Cancel (reset form)
- Validation feedback:
  - Inline error messages
  - Field highlighting
  - Submission prevention for invalid data
- Status indicators:
  - Loading state
  - Success message
  - Error feedback

### Candidate List View

- Display columns:
  - ID
  - Full Name
  - Email
  - Status (with color indicators matching the specified hex colors)
  - Created Date
  - Actions (Edit, Delete, Download CV)
- Features:
  - Pagination (10 rows per page)
  - Filter, order and search functionality (implemented client-side in the frontend)
  - Sorting options for all columns
  - Status filtering with visual indicators (PENDING, VALUATED, DISCARDED)
  - Client-side text search that filters results as the user types

### Security & Best Practices

The project follows industry-standard best practices:

- Security guidelines are documented in `owasp.md`
- Development standards are available in:
  - Backend: `backend/best-practise.md`
  - Frontend: `frontend/best-practise.md`

## Development Guidelines

Please refer to the following documentation for detailed development standards:

1. **Backend Development**: See `backend/best-practise.md` for TypeScript patterns, API design, testing approach, and more.

2. **Frontend Development**: See `frontend/best-practise.md` for React patterns, component design, state management, and testing standards.

3. **Architecture**: Follow the aggregate-based structure for all new features:

   - Each aggregate should have its own directory in each layer
   - Maintain consistent naming across layers (e.g., entity.ts, repository.ts)
   - Use index.ts files to simplify imports
   - Keep aggregates independent of each other when possible

4. **Testing**:

   - Write unit tests for all business logic
   - Mock external dependencies
   - Exclude index.ts files from test coverage
   - Maintain at least 70% code coverage

5. **Security**: Follow OWASP guidelines in `owasp.md` for ensuring application security.

## Implementation Plan

### Step 1: Project Setup

1. **Repository & Environment Configuration**

   - Initialize Git repository
   - Set up Docker configuration for PostgreSQL
   - Configure environment variables in .env file to match these database connection details
   - Create upload folder with the right permissions (chmod 777 for development, more restricted for production)
   - Validate database connection from both local environment and containerized services

2. **Backend Structure**

   - Create Domain-Driven Design folder structure following `backend/best-practise.md`:
     - `/domain`: Entities, value objects, repository interfaces
     - `/application`: Services and use cases
     - `/infrastructure`: Repository implementations, external services
     - `/presentation`: Controllers, routes, middleware
   - Organize each layer by aggregates (e.g., `/domain/candidate`, `/application/candidate`)
   - Each aggregate follows a consistent structure across all layers
   - Use index.ts files to simplify imports
   - Configure TypeScript using best practices
   - Set up routing with RESTful principles

3. **Frontend Structure**
   - Create utility folders following `frontend/CONTRIBUTING.md`:
     - `/components`: Reusable React components
     - `/pages`: Page-level components
     - `/hooks`: Custom React hooks
     - `/services`: API clients
     - `/utils`: Helper functions
     - `/types`: TypeScript definitions
     - `/context`: State management
     - `/tests`: Test utilities

### Step 2: Core Backend Implementation

1. **Data Layer**

   - Implement Prisma models
   - Create repository interfaces and implementations
   - Ensure separation of concerns between domain and infrastructure

2. **Business Logic Layer**

   - Implement services with proper validation
   - Create file storage service with security features
   - Establish error handling patterns

3. **API Layer**
   - Create RESTful controllers
   - Implement middleware for validation
   - Set up security headers and authentication framework

### Step 3: Frontend Foundation

1. **UI Component Library**

   - Set up shadcn/ui
   - Create base layout and theme
   - Implement responsive design patterns

2. **State Management**

   - Configure Context API for global state
   - Implement data fetching patterns
   - Create API service interfaces

3. **Form System**
   - Build reusable form components
   - Implement client-side validation
   - Create autocompletion system for Education and Experience fields

### Step 4: Feature Implementation

1. **Dashboard**

   - Implement statistics cards
   - Create data visualization components
   - Set up real-time updates

2. **Candidate Management**

   - Build candidate form with validation
   - Implement list view with sorting and filtering
   - Create detail view with actions

3. **File Management**
   - Implement secure file upload
   - Create file download functionality
   - Ensure proper validation and error handling

### Step 5: Testing & Refinement

1. **Unit Testing**

   - Test services and repositories
   - Implement component tests
   - Ensure test coverage meets standards (80%+)

2. **Integration Testing**

   - Test API endpoints
   - Verify form submissions
   - Test file upload/download

3. **UI/UX Refinement**
   - Implement loading states
   - Add error handling UI
   - Polish responsive behavior

### Step 6: Deployment & Documentation

1. **Deployment Pipeline**

   - Configure CI/CD
   - Set up staging environment
   - Prepare production deployment

2. **Documentation**

   - Update technical documentation
   - Create user guides
   - Document API endpoints

3. **Performance Optimization**
   - Profile and optimize backend
   - Implement frontend optimizations
   - Verify scalability under load

Ecco ti do un PROMPT controlla quello che abbiamo gia' e procedi a far funzionare tutta l'applicazione attualmente abbiamo

BACKJEND e LAYOUT FRONTEND ma potrebbero esserci delle parti mancanti
