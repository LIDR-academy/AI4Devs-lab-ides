# Backend Task: Adding Candidates

## Description:
Develop the backend required to process the information entered in the candidate addition form.

## Acceptance Criteria:
* Implement API endpoints to handle the submission of candidate information.
* Ensure the data is validated on the server side to ensure completeness and correctness.
* Implement functionality to handle the upload and storage of candidate CVs in PDF or DOCX format.
* Ensure the security and privacy of the candidate’s data.
* Implement error handling to manage issues such as server connection failures and invalid data submissions.
* Ensure the backend functionality is compatible with different devices and web browsers.

## Notes:
* Follow best practices for API development and data security.
* Consider scalability and performance when designing the backend architecture.

## Development Tasks:
- [ ] Create API endpoint for submitting candidate information
- [ ] Implement data validation middleware for candidate submissions
- [ ] Implement error handling middleware
- [ ] Create database schema and models for candidate data
- [ ] Add API documentation using OpenAPI/Swagger
- [ ] Write unit tests for the candidate submission flow

## Comments:
- We'll store the uploaded CVs as blobs in the database for simplicity.
- Maybe we should encrypt PII data in the database to enhance security, but we'll defer that until a security review.

## Data Requirements:

### Database Schema Overview:
- Candidates (main table):
  - UUID (primary key)
  - Personal Information Fields
  - Professional Summary Fields
  - Created At
  - Updated At
  - Status (Active/Archived)

- Work Experience (one-to-many):
  - UUID (primary key)
  - Candidate ID (foreign key)
  - Experience Fields
  - Order Index

- Education (one-to-many):
  - UUID (primary key)
  - Candidate ID (foreign key)
  - Education Fields
  - Order Index

- Skills (many-to-many):
  - Skill ID
  - Candidate ID
  - Proficiency Level

- Attachments (one-to-many):
  - UUID (primary key)
  - Candidate ID (foreign key)
  - File Type (CV/CoverLetter/Portfolio)
  - File Name
  - File Path/URL
  - Upload Date

### Data Validation Rules:
- Email: RFC 5322 standard
- Phone: E.164 format
- URLs: Valid URL format
- Dates: ISO 8601 format
- File attachments:
  - Max size: 10MB
  - Formats: PDF, DOCX
  - Virus scanning required
