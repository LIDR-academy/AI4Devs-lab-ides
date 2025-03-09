import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CandidateForm from '../components/CandidateForm';
import { CandidateStatus } from '../types/Candidate';

// Mock the EducationSelector component
jest.mock('../components/EducationSelector', () => {
  return function MockEducationSelector({ selectedEducation, onChange }: { selectedEducation: any[], onChange: (data: any[]) => void }) {
    return (
      <div data-testid="education-selector">
        <button 
          data-testid="add-education-button"
          onClick={() => onChange([...selectedEducation, {
            degree: 'Test Degree',
            institution: 'Test Institution',
            fieldOfStudy: 'Test Field',
            startYear: 2020,
            endYear: 2024,
            isCurrentlyStudying: false
          }])}
        >
          Add Education
        </button>
        <div>
          {selectedEducation?.map((item, index) => (
            <div key={index} data-testid={`education-item-${index}`}>
              {item.degree} at {item.institution}
            </div>
          ))}
        </div>
      </div>
    );
  };
});

// Mock the ConfirmationDialog component
jest.mock('../components/ConfirmationDialog', () => {
  return function MockConfirmationDialog({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) {
    if (!isOpen) return null;
    return (
      <div data-testid="confirmation-dialog">
        <button onClick={onConfirm} data-testid="confirm-button">Confirm</button>
        <button onClick={onCancel} data-testid="cancel-button">Cancel</button>
      </div>
    );
  };
});

describe('CandidateForm Component', () => {
  let mockSubmit: jest.Mock;
  let mockCancel: jest.Mock;
  const initialData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+11234567890',
    position: 'Software Engineer',
    status: CandidateStatus.NEW,
    notes: '',
    education: []
  };
  
  beforeEach(() => {
    mockSubmit = jest.fn();
    mockCancel = jest.fn();
    jest.clearAllMocks();
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });
  
  it('renders the form with all required fields', async () => {
    await act(async () => {
      render(
        <CandidateForm 
          onSubmit={mockSubmit} 
          onCancel={mockCancel}
        />
      );
    });
    
    // Check for required input fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /Update Candidate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
  
  it('should render the form with initial data when provided', async () => {
    await act(async () => {
      render(
        <CandidateForm 
          onSubmit={mockSubmit} 
          onCancel={mockCancel}
          initialData={initialData}
          isEditing={true}
        />
      );
    });
    
    // Check if form fields are populated with initial data
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('+11234567890');
    
    // Check if the submit button says "Update Candidate" in edit mode
    expect(screen.getByRole('button', { name: /update candidate/i })).toBeInTheDocument();
  });
  
  it('calls onCancel when cancel button is clicked', async () => {
    await act(async () => {
      render(
        <CandidateForm 
          onSubmit={mockSubmit} 
          onCancel={mockCancel}
        />
      );
    });
    
    // Click the cancel button
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    });
    
    // Check if onCancel was called
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
  
  it('should not show confirmation dialog when backdrop is clicked without changes', async () => {
    await act(async () => {
      render(
        <CandidateForm 
          onSubmit={mockSubmit} 
          onCancel={mockCancel}
        />
      );
    });
    
    // Click the modal backdrop (form container) without making changes
    await act(async () => {
      fireEvent.click(screen.getByTestId('candidate-form-container'));
    });
    
    // window.confirm should not be called
    expect(window.confirm).not.toHaveBeenCalled();
    
    // onCancel should be called directly
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
}); 