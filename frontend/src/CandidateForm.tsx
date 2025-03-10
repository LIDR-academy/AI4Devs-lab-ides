import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './CandidateForm.css';

// Validation schema using Yup
const CandidateSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number'),
  address: Yup.string(),
  education: Yup.string(),
  workExperience: Yup.string(),
});

const CandidateForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Check file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setSubmitStatus({
          success: false,
          message: 'Only PDF and DOCX files are allowed',
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          success: false,
          message: 'File size must be less than 5MB',
        });
        return;
      }
      
      setSelectedFile(file);
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Create form data to handle file upload
      const formData = new FormData();
      
      // Add all form fields to formData
      Object.keys(values).forEach(key => {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      });
      
      // Add file if selected
      if (selectedFile) {
        formData.append('cvFile', selectedFile);
      }
      
      // Send data to the backend
      const response = await axios.post(
        'http://localhost:3010/api/candidates',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Handle success
      setSubmitStatus({
        success: true,
        message: 'Candidate added successfully!',
      });
      
      // Reset form
      resetForm();
      setSelectedFile(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      
    } catch (error: any) {
      // Handle error
      console.error('Error submitting form:', error);
      
      setSubmitStatus({
        success: false,
        message: error.response?.data?.error || 'Failed to add candidate. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="candidate-form-container">
      <h2>Add New Candidate</h2>
      
      {submitStatus && (
        <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          education: '',
          workExperience: '',
        }}
        validationSchema={CandidateSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="candidate-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <Field name="firstName" className={errors.firstName && touched.firstName ? 'error-input' : ''} />
              <ErrorMessage name="firstName" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <Field name="lastName" className={errors.lastName && touched.lastName ? 'error-input' : ''} />
              <ErrorMessage name="lastName" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <Field name="email" type="email" className={errors.email && touched.email ? 'error-input' : ''} />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <Field name="phone" className={errors.phone && touched.phone ? 'error-input' : ''} />
              <ErrorMessage name="phone" component="div" className="error-message" />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <Field name="address" as="textarea" />
            </div>
            
            <div className="form-group">
              <label htmlFor="education">Education</label>
              <Field name="education" as="textarea" />
            </div>
            
            <div className="form-group">
              <label htmlFor="workExperience">Work Experience</label>
              <Field name="workExperience" as="textarea" />
            </div>
            
            <div className="form-group">
              <label htmlFor="cvFile">CV (PDF or DOCX)</label>
              <input
                id="cvFile"
                name="cvFile"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div className="file-info">
                  Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
            </div>
            
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Submitting...' : 'Add Candidate'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CandidateForm;
