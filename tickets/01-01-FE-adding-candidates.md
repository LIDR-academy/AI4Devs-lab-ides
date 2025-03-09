# Frontend Task: Adding Candidates

## Description:
Implement the user interface for adding candidates to the ATS system.

## Acceptance Criteria:
* There should be a clearly visible button or link to add a new candidate from the recruiter’s main dashboard page.
* When selecting the option to add a candidate, a form should appear including the necessary fields to capture the candidate’s information, such as first name, last name, email, phone number, address, education, and work experience.
* The form must validate the entered data to ensure completeness and correctness. For example, the email should have a valid format, and required fields must not be left empty.
* The recruiter should have the option to upload the candidate’s CV in PDF or DOCX format.
* Once the form is completed and submitted, a confirmation message should appear, indicating that the candidate has been successfully added to the system.
* In case of an error (e.g., server connection failure), the system should display an appropriate message informing the user of the issue.
* The functionality should be accessible and compatible with different devices and web browsers.

## Data Requirements:

### Required Fields:
- Personal Information:
  - First Name
  - Last Name
  - Email
  - Phone Number
  - Current Location (City, Country)
  - LinkedIn Profile URL
  - Willing to Relocate (Yes/No)

- Professional Summary:
  - Current Job Title
  - Years of Experience
  - Key Skills (multiple)
  - Expected Salary Range

### Optional Fields:
- Work Experience (multiple entries):
  - Company Name
  - Position
  - Location
  - Start Date
  - End Date
  - Description
  - Technologies/Tools Used

- Education (multiple entries):
  - Institution Name
  - Degree/Certification
  - Field of Study
  - Graduation Date
  - GPA (if applicable)

- Additional Information:
  - Portfolio URL
  - GitHub Profile
  - Other Social Media
  - Preferred Work Type (Remote/Hybrid/Onsite)
  - Notice Period
  - Visa Status
  - Languages (with proficiency levels)

### Attachments:
- CV/Resume (PDF/DOCX)
- Cover Letter (optional)
- Portfolio/Work Samples (optional)

## Notes:
* The interface should be intuitive and easy to use to minimize the training time required for new recruiters.
* Consider integrating autocomplete functionalities for the education and work experience fields, based on existing data in the system.

## Development Tasks:
- [ ] DEFER: Create a button or link on the recruiter’s main dashboard page to add a new candidate.
- [ ] Develop a form to capture the candidate’s information, including first name, last name, email, phone number, address, education, and work experience.
- [ ] Implement client-side validation for the form to ensure completeness and correctness of the entered data.
- [ ] Add functionality to upload the candidate’s CV in PDF or DOCX format.
- [ ] Display a confirmation message upon successful submission of the form.
- [ ] Implement error handling to display appropriate messages in case of issues such as server connection failures.
- [ ] Ensure the interface is accessible and compatible with different devices and web browsers.
