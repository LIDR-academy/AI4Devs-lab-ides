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
   REJECTED
   INTERVIEW
   OFFERED
   HIRED
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

4. **Security**: Follow OWASP guidelines in `owasp.md` for ensuring application security.

## Development Tickets

### Ticket 1: Data Model Implementation

**Objective**: Ensure the Prisma data model is correctly implemented and migrations are working properly.

**Tasks**:

- Review and finalize the Candidate model:

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
    REJECTED
    INTERVIEW
    OFFERED
    HIRED
  }
  ```

- Verify PostgreSQL connection in Docker environment
- Generate and run Prisma migrations
- Create seed data for testing
- Implement proper environment variable handling

### Ticket 2: Backend Development

**Objective**: Complete the backend implementation following Domain-Driven Design principles.

**Tasks**:

- Implement remaining API endpoints:
  - `POST /api/candidates` - Create candidate with file upload
  - `GET /api/candidates` - List candidates with pagination & sorting
  - `GET /api/candidates/:id` - Get single candidate
  - `PUT /api/candidates/:id` - Update candidate
  - `DELETE /api/candidates/:id` - Delete candidate and CV
  - `GET /api/candidates/:id/cv` - Download candidate CV
  - `GET /api/statistics` - Get dashboard statistics
- Create validation middleware with Zod schemas
- Implement secure file storage for CVs
- Add proper error handling and response formatting
- Ensure the backend follows DDD and Hexagonal Architecture:
  - `/domain`: Entities, value objects, repository interfaces
  - `/application`: Services and use cases
  - `/infrastructure`: Repository implementations, file services
  - `/presentation`: Controllers, routes, middleware
- Implement unit tests with Jest focusing on business logic

### Ticket 3: Frontend Development

**Objective**: Complete the frontend implementation with React and Tailwind

**Tasks**:

- Implement Dashboard view with statistics cards:
  - Total candidates
  - Pending candidates
  - Valuated candidates
  - Discarded candidates
- Create Candidate Management pages:
  - List view with sorting, filtering, and pagination
  - Add/Edit form with validation
  - Detail view with actions (download CV, change status)
- Build modal component for adding candidates
- Implement search functionality in the header
- Add client-side filtering and sorting
- Style the application using the defined color palette:

  - Primary: #0f172a
  - Secondary: #4f46e5
  - Status colors:
    - PENDING: #f59e0b
    - VALUATED: #10b981
    - DISCARDED: #ef4444

- Implement proper loading states and error handling
- Add unit tests for React components

### Ticket 4: Other small adjustments

- Logs
- UI
- Toas error messages
- Autocompletion system for Education and Experience
- React router
- Reasuble components
