import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Alert, Card } from 'react-bootstrap';

interface CandidateFormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: any;
  workExperience: any;
  cv: FileList;
}

interface ApiError {
  error: string;
  message: string;
}

export const CandidateForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CandidateFormData>();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (data: CandidateFormData) => {
      try {
          setSubmitStatus('loading');
          setErrorMessage('');
          
          const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('education', JSON.stringify(data.education || {}));
      formData.append('workExperience', JSON.stringify(data.workExperience || {}));
      
      if (data.cv && data.cv[0]) {
        formData.append('cv', data.cv[0]);
      }

      const response = await fetch('http://localhost:3010/api/candidates', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        if (response.status === 409) {
            setErrorMessage(result.message);
        } else {
            setErrorMessage('Failed to add candidate. Please try again.');
        }
        setSubmitStatus('error');
        return;
    }
    
    setSubmitStatus('success');
    reset(); // Clear form on success
} catch (error) {
    console.error('Error:', error);
    setErrorMessage('An unexpected error occurred. Please try again.');
    setSubmitStatus('error');
}
};

return (
  <Card>
      <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.name}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.lastName}
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <Form.Control.Feedback type="invalid">
                {errors.lastName.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              isInvalid={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone *</Form.Label>
            <Form.Control
              type="tel"
              isInvalid={!!errors.phone}
              {...register('phone', { required: 'Phone is required' })}
            />
            {errors.phone && (
              <Form.Control.Feedback type="invalid">
                {errors.phone.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address *</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.address}
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && (
              <Form.Control.Feedback type="invalid">
                {errors.address.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CV (PDF or DOCX) *</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.docx"
              isInvalid={!!errors.cv}
              {...register('cv', {
                required: 'CV is required',
                validate: {
                  fileFormat: (files: FileList) =>
                    !files[0] || ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                      .includes(files[0]?.type) || 'File must be PDF or DOCX'
                }
              })}
            />
            {errors.cv && (
              <Form.Control.Feedback type="invalid">
                {errors.cv.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button
                        type="submit"
                        variant="primary"
                        className="w-100"
                        disabled={submitStatus === 'loading'}
                    >
                        {submitStatus === 'loading' ? 'Submitting...' : 'Add Candidate'}
                    </Button>

                    {submitStatus === 'success' && (
                        <Alert variant="success" className="mt-3">
                            Candidate added successfully!
                        </Alert>
                    )}

                    {submitStatus === 'error' && (
                        <Alert variant="danger" className="mt-3">
                            {errorMessage}
                        </Alert>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
};