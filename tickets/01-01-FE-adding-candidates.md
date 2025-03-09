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

- Professional Information:
  - Years of Experience (integer)
  - Education Level (select: None/High School/Bachelor's/Master's/PhD)
  - (v2) Current Job Title
  - (v2) Key Skills (comma-separated list)

### Optional Fields:
  - (v2) LinkedIn Profile URL
  - (v2) Expected Salary Range
  - (v2) Preferred Work Type (Remote/Hybrid/Onsite)
  - (v2) Notice Period (in weeks)

### Attachments:
  - CV/Resume (PDF/DOCX)

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
