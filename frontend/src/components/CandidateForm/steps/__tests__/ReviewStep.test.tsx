import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewStep from '../ReviewStep';
import { FormProvider } from '../../../../context/FormContext';

// Mock data
const mockFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  education: [
    {
      title: 'Computer Science',
      institution: 'MIT',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2022-06-01')
    }
  ],
  workExperience: [
    {
      company: 'Tech Corp',
      position: 'Software Engineer',
      startDate: new Date('2022-07-01'),
      endDate: new Date('2023-12-31')
    }
  ],
  document: {
    name: 'resume.pdf',
    file: new File([''], 'resume.pdf', { type: 'application/pdf' })
  }
};

const mockDispatch = jest.fn();

// Mock the useForm hook
jest.mock('../../../../context/FormContext', () => {
  const actual = jest.requireActual('../../../../context/FormContext');
  return {
    ...actual,
    useForm: jest.fn().mockImplementation(() => ({
      state: { formData: mockFormData },
      dispatch: mockDispatch
    }))
  };
});

describe('ReviewStep', () => {
  const renderReviewStep = () => {
    return render(
      <FormProvider>
        <ReviewStep />
      </FormProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections of the review', () => {
    renderReviewStep();
    
    // Personal Information
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();

    // Education
    expect(screen.getByText('Education History')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('MIT')).toBeInTheDocument();

    // Work Experience
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();

    // Document
    expect(screen.getByText('Uploaded Document')).toBeInTheDocument();
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });

  it('sanitizes and escapes HTML in user input', () => {
    const xssFormData = {
      ...mockFormData,
      firstName: '<script>alert("xss")</script>',
      lastName: '<img src="x" onerror="alert(1)">',
    };

    const { useForm } = jest.requireMock('../../../../context/FormContext');
    useForm.mockImplementationOnce(() => ({
      state: { formData: xssFormData },
      dispatch: mockDispatch
    }));

    render(
      <FormProvider>
        <ReviewStep />
      </FormProvider>
    );

    const content = screen.getByTestId('personal-info');
    expect(content).not.toContain('<script>');
    expect(content).not.toContain('<img');
    expect(content.innerHTML).toEqual(expect.not.stringContaining('onerror'));
  });

  it('formats dates correctly', () => {
    renderReviewStep();
    
    // Check education dates
    expect(screen.getByText(/September 2018/)).toBeInTheDocument();
    expect(screen.getByText(/June 2022/)).toBeInTheDocument();

    // Check work experience dates
    expect(screen.getByText(/July 2022/)).toBeInTheDocument();
    expect(screen.getByText(/December 2023/)).toBeInTheDocument();
  });

  it('handles missing or incomplete data gracefully', () => {
    const incompleteFormData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      education: [],
      workExperience: [],
      document: null
    };

    const { useForm } = jest.requireMock('../../../../context/FormContext');
    useForm.mockImplementationOnce(() => ({
      state: { formData: incompleteFormData },
      dispatch: mockDispatch
    }));

    render(
      <FormProvider>
        <ReviewStep />
      </FormProvider>
    );

    expect(screen.getByText('No education history provided')).toBeInTheDocument();
    expect(screen.getByText('No work experience provided')).toBeInTheDocument();
    expect(screen.getByText('No document uploaded')).toBeInTheDocument();
  });
}); 