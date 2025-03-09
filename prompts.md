# ATS "Add Candidate" Feature Development Prompts

**Prompt Source:** Claude 3.7 Sonnet by Anthropic in Cursor IDE

---

1. 🔹 Project Context  
   We are developing an Applicant Tracking System (ATS) for LTI, enabling recruiters to manage candidates efficiently. The project already has a basic structure with a backend (Node.js + Express) and a frontend (React). Now, we need to implement the functionality to add candidates to the system.

🛠 Technologies in Use  
Frontend: React (with Vite) + Tailwind CSS  
Backend: Node.js + Express  
Database: PostgreSQL (via Prisma ORM)  
File Upload: Multer (for CVs in PDF/DOCX format)

🚀 Tasks to Implement "Add Candidate" Feature  
1️⃣ Backend - API for Candidate Management  
Create a Prisma model for candidates with fields:  
id, firstName, lastName, email, phone, address, education, workExperience, cvFilePath  
Implement a REST API with the following endpoints:  
POST /candidates → Save candidate data in the database.  
GET /candidates → Retrieve a list of candidates.  
GET /candidates/:id → Fetch a specific candidate.  
Set up Multer for CV file uploads.  
Implement data validation to ensure valid email format, required fields, etc.  
Handle error responses properly.

2️⃣ Frontend - Candidate Form UI  
Create a candidate registration form with fields:  
Name, last name, email, phone, address, education, work experience, CV upload.  
Implement form validation (e.g., required fields, valid email format).  
Use React Query or Axios to send a POST request to the backend.  
Show success/error messages after form submission.  
Ensure accessibility and responsive design.

3️⃣ Database - Define & Migrate Candidate Model  
Modify schema.prisma to add the Candidate model.  
Run Prisma migrations to update the PostgreSQL database.

4️⃣ Testing & Debugging  
Ensure API endpoints work correctly using Postman or Thunder Client.  
Test the frontend form to verify data is submitted and saved properly.  
Fix any issues related to CORS, database connections, or file uploads.

---

2. styles for frontend are not working. This is image of how it looks now

---

3. when I submit form with only mandatory fields marked with asterisk (Name, Surname, Email) I got this error `An error occurred while submitting the form`

---

4. I got error `Valid phone number is required` but phone number input does not have saterisk in label indicating as mandatory. Fix this issue and also add sterisk to labels of mandatory fields.

---

5. It is working well. Now let's add home page as this is only candidate adding screen. On home page I want to see list of all candidates and also button which takes me on the page which we already implemented

---

6. there was error with npm start in last step

---

7. We have implemented the "Add Candidate" functionality in our ATS project. Now, we need to verify if the system ensures data security and privacy properly.

Key Security Aspects to Check:  
Data Protection:

- Are candidate details (name, email, phone, address, etc.) stored securely in the database?
- Are passwords or sensitive data (if applicable) encrypted?

File Upload Security:

- Is the CV file upload process protected against malicious files?
- Are file size limits and allowed file types (PDF/DOCX) enforced?
- Is the upload directory secure, preventing unauthorized access?

API Security:

- Are input validations in place to prevent SQL injection, XSS, or other vulnerabilities?
- Does the API implement authentication and authorization for sensitive actions?
- Are error messages generic to avoid exposing system details?

Privacy Compliance:

- Are GDPR or data protection guidelines followed?
- Are candidate records properly protected from unauthorized access?

---

8. We need to ensure that our "Add Candidate" feature is accessible and works across different devices and browsers.

🔹 Requirements:  
Accessibility (A11y) Compliance:

- Ensure keyboard navigation works for all form elements.
- Use ARIA attributes where necessary for screen readers.
- Add semantic HTML elements for better accessibility.
- Provide error messages in a clear, readable format.

Responsive Design:

- Ensure the form adapts well to mobile, tablet, and desktop screen sizes.
- Use flexible layouts (CSS Grid or Flexbox) to maintain a good user experience.
- Test the UI at different resolutions.

Cross-Browser Compatibility:

- Ensure the feature works correctly in Chrome, Firefox, Safari, and Edge.
- Test for consistent styling and functionality across browsers.

Performance Considerations:

- Optimize UI elements for fast loading on mobile networks.
- Ensure animations or interactions don’t cause accessibility issues.

---

9. We need to enhance the "Add Candidate" form by integrating autocomplete functionality for the Education and Work Experience fields. This should be based on pre-existing data stored in the system to improve usability and data consistency.

🔹 Requirements:  
Backend Enhancements:

- Create an API endpoint (GET /autocomplete/education and GET /autocomplete/experience) to fetch suggested values.
- Fetch existing education levels (e.g., Bachelor's, Master's, PhD) from the database.
- Fetch common job titles/roles based on previously added candidates.

Frontend Enhancements:

- Implement an autocomplete dropdown for both fields.
- As the user types, show dynamic suggestions retrieved from the backend.
- Allow users to select from the list or enter custom values.
- Ensure keyboard navigation (Arrow keys + Enter to select).

Performance & UX Considerations:

- Use debouncing to prevent excessive API calls.
- Optimize for fast response times when fetching suggestions.
- Ensure the UI is accessible and works on all devices.

---

10. We need to add functionality to delete candidates from the list in our ATS application. This will allow recruiters to manage candidates more effectively.

🔹 Requirements:  
Backend Enhancements:

- Implement a DELETE endpoint in the API (DELETE /candidates/:id) to delete a candidate by their unique id.
- Ensure that the candidate data is properly removed from the database.
- Handle error scenarios, such as attempting to delete a candidate that doesn't exist or has already been deleted.
- Return a success message when the deletion is successful, and an error message if it fails.

Frontend Enhancements:

- Add a "Delete" button next to each candidate entry in the list.
- Implement a confirmation prompt when a recruiter clicks the delete button (e.g., "Are you sure you want to delete this candidate?").
- On confirmation, send a DELETE request to the backend to remove the candidate.
- Update the UI dynamically to remove the candidate from the list after successful deletion.
- Show a success or error notification to inform the recruiter about the result of the action.

Performance & UX Considerations:

- Ensure the delete action is fast and doesn't negatively impact the user experience.
- Ensure that error handling and notifications are clear and easy to understand for the user.

---

11. I got error when adding candidate saying `Error!  
Failed to create candidate`, without any other details. In console I see error CandidateForm.tsx:80 Form submission error:  
    AxiosError  
    onError @ CandidateForm.tsx:80.

Also when I submit form I get error that I did not agree to privacy policy but there is no checkbox or something similar to accept.

---

12. there is one bug. when candidate is saved successfully all input fields are empty again to start adding another candidate, except education and work experience.

---

13. we did not fix the bug, education and work experience does not empty, neither name of uploaded file

---

14. we have error in terminal where backend code is running

---

15. we have some bugs:

1) CV file upload functionality is broken.
2) When deleting candidate it also must delete corresponding CV file.
3) Accept privacy policy does not have checkbox where user can accept, or it is not visible.
4) when user chooses option from education or work experience autocomplete it must close autocompletion block and must not be necessary to click outside for closing it.

---

16. remove functionality to encrypt phone number. Also file upload is broken, I select file when adding candidate but it is not uploading. Also there is no checkbox to accept privacy policy and I am getting error that I must accept, remove functionality of checkbox and leave privacy policy message as it is now assuming that when user adds candidate it accepts privacy policy

---

17. There is error in console: Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.

1) Remove address encryption
2) Show date in european format: dd/MM/yyyy
3) File upload continues as broken, in database cvFilePath is empty and there is no file in uploads

---

18. Upload middleware called, files in request: undefined  
    No file was uploaded with this request

api.ts:107 Error creating candidate:  
{errors: Array(3)}  
CandidateForm.tsx:229 Error creating candidate:  
AxiosError {message: 'Request failed with status code 400', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}

---

19. In backend terminal we again have this message: Upload middleware called, files in request: undefined No file was uploaded with this request File upload info: { fileExists: false, filename: undefined, cvFilePath: null }
