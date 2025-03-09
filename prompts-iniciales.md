# Prompts Iniciales

## Ticket 1: Database Model and Migration for Candidate Management

I need to create a Prisma schema for a candidate management system with the following requirements:

1. Create a Candidate model with these fields:
   - id (auto-generated primary key)
   - firstName (required string)
   - lastName (required string)
   - email (required string, unique)
   - phone (optional string)
   - address (optional string)
   - education (array of Education records)
   - experience (array of WorkExperience records)
   - resumeUrl (optional string to store the file path)
   - createdAt (datetime)
   - updatedAt (datetime)

2. Create related models:
   - Education model with fields for institution, degree, fieldOfStudy, startDate, endDate
   - WorkExperience model with fields for company, position, description, startDate, endDate

3. Set up appropriate relationships between these models

4. Create a migration script to initialize the database

5. Include sample seeding data for testing purposes

Please provide the complete Prisma schema and the commands I'll need to run for migration and seeding. The database is PostgreSQL running on Docker as specified in the README.


## Ticket 2: Backend API Development for Candidate Management

I need to develop the backend API for a candidate management system using Express.js, TypeScript, and Prisma ORM. The README shows our project structure has a backend folder with Express and Prisma already set up.

Please implement:

1. A RESTful API endpoint that allows recruiters to add new candidates with the following requirements:
   - POST /api/candidates endpoint
   - Request body validation for required fields (firstName, lastName, email)
   - Email format validation
   - Proper error handling
   - Support for optional fields (phone, address)
   - Ability to create related education and work experience records
   - File upload handling for resume documents (PDF/DOCX)
   - Secure file storage
   - Successful response with the newly created candidate data

2. A GET /api/candidates endpoint to retrieve the list of candidates

3. Include appropriate middleware for:
   - Request validation
   - Error handling
   - File upload processing

4. Proper TypeScript types/interfaces for all request and response objects

5. Unit tests for the API endpoints

Please provide the necessary code files including controllers, routes, middleware, and test files. Explain any dependencies I need to add beyond what's already in the project.
