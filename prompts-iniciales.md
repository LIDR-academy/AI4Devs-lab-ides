# Prompts Iniciales

## Database Model and Migration for Candidate Management

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
