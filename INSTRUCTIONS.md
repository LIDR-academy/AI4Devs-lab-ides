# LIDR AI4Devs - Recruitment Application
This document provides step-by-step instructions to set up and run the application.

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions
### 2. Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
 ```

2. Install dependencies:
```bash
npm install
 ```

3. Generate Prisma client:
```bash
npm run prisma:generate
 ```

4. Run database migrations:
```bash
npx prisma migrate dev
 ```

5. Seed the database:
```bash
npm run seed
 ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
 ```

2. Install dependencies:
```bash
npm install
 ```

### 4. Running the Application Start the Backend
1. From the backend directory:
```bash
npm run dev
 ```

The backend will run on http://localhost:8000
 Start the Frontend
1. From the frontend directory:
```bash
npm start
 ```

The frontend will run on http://localhost:3000

## Default Admin Account
Use these credentials to log in:

- Email: recruiter@test.com
- Password: password123
## Additional Information
### Environment Variables
Make sure these environment variables are set in your backend .env :

- JWT_SECRET - Secret key for JWT token generation
- ENCRYPTION_KEY - Key for data encryption
- UPLOAD_DIR - Directory for document uploads
### Features Available
- Candidate Management (CRUD operations)
- Document Upload/Download
- Education & Experience tracking
- Secure data encryption
- User authentication
### Troubleshooting
1. If database seeding fails:
   
   - Ensure PostgreSQL is running
   - Check database connection string
   - Run npx prisma migrate reset to reset the database
2. If file uploads don't work:
   
   - Ensure the UPLOAD_DIR exists and has write permissions
   - Check file size limits in backend configuration.