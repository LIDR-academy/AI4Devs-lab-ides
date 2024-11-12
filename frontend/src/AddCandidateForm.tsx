import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';

const AddCandidateForm = () => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: '',
    resume: null,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
  });

  const handleSubmit = (values: any) => {
    console.log('Form data', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }: { setFieldValue: (field: string, value: any) => void }) => (
        <Form>
          <div>
            <Field name="firstName" as={TextField} label="First Name" fullWidth />
            <ErrorMessage name="firstName" component="div" />
          </div>
          <div>
            <Field name="lastName" as={TextField} label="Last Name" fullWidth />
            <ErrorMessage name="lastName" component="div" />
          </div>
          <div>
            <Field name="email" as={TextField} label="Email" fullWidth />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <Field name="phone" as={TextField} label="Phone" fullWidth />
            <ErrorMessage name="phone" component="div" />
          </div>
          <div>
            <Field name="address" as={TextField} label="Address" fullWidth />
          </div>
          <div>
            <Field name="education" as={TextField} label="Education" fullWidth />
          </div>
          <div>
            <Field name="workExperience" as={TextField} label="Work Experience" fullWidth />
          </div>
          <div>
            <input
              id="resume"
              name="resume"
              type="file"
              onChange={(event) => {
                setFieldValue("resume", event.currentTarget.files[0]);
              }}
            />
          </div>
          <Button type="submit" variant="contained" color="primary">
            Add Candidate
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AddCandidateForm;