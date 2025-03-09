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
  - First Name (varchar)
  - Last Name (varchar)
  - Email (varchar, unique)
  - Phone Number (varchar)
  - Current Location (varchar)
  - Years Experience (integer)
  - Education Level (enum)
  - Current Job Title (varchar)
  - Key Skills (text)
  - LinkedIn Profile (varchar, nullable)
  - Expected Salary Range (varchar, nullable)
  - Preferred Work Type (enum, nullable)
  - Notice Period (integer, nullable)
  - Created At (timestamp)
  - Updated At (timestamp)
  - Status (enum: Active/Archived)

- Attachments:
  - UUID (primary key)
  - Candidate ID (foreign key)
  - File Name (varchar)
  - File Content (blob)
  - Upload Date (timestamp)

### Data Validation Rules:
- Email: RFC 5322 standard
- Phone: E.164 format
- Years Experience: Non-negative integer
- Education Level: One of [None, High School, Bachelor's, Master's, PhD]
- File attachments:
  - Max size: 10MB
  - Formats: PDF, DOCX
  - Virus scanning required
