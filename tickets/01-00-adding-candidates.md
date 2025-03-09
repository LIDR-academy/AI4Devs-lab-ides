# Story

As a recruiter,
I want to have the ability to add candidates to the ATS system,
So that I can efficiently manage their data and selection processes.

## Acceptance Criteria:
* Function Accessibility: There should be a clearly visible button or link to add a new candidate from the recruiter’s main dashboard page.
* Data Entry Form: When selecting the option to add a candidate, a form should appear including the necessary fields to capture the candidate’s information, such as first name, last name, email, phone number, address, education, and work experience.
* Data Validation: The form must validate the entered data to ensure completeness and correctness. For example, the email should have a valid format, and required fields must not be left empty.
* Document Upload: The recruiter should have the option to upload the candidate’s CV in PDF or DOCX format.
* Confirmation of Addition: Once the form is completed and submitted, a confirmation message should appear, indicating that the candidate has been successfully added to the system.
* Error Handling and Exceptions: In case of an error (e.g., server connection failure), the system should display an appropriate message informing the user of the issue.
* Accessibility and Compatibility: The functionality should be accessible and compatible with different devices and web browsers.

## Notes:
* The interface should be intuitive and easy to use to minimize the training time required for new recruiters.
* Consider integrating autocomplete functionalities for the education and work experience fields, based on existing data in the system.

## Technical Tasks:
* Implement the user interface for the candidate addition form.
* Develop the backend required to process the information entered in the form.
* Ensure the security and privacy of the candidate’s data.
