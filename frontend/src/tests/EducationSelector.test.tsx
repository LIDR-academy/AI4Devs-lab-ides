import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EducationSelector from '../components/EducationSelector';

// Mock the Modal component
jest.mock('../components/Modal', () => {
  return function MockModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
    footer?: React.ReactNode; 
  }) {
    if (!isOpen) return null;
    return (
      <div className="mock-modal" data-testid="modal">
        <div className="mock-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} data-testid="modal-close-btn">×</button>
        </div>
        <div className="mock-modal-body">
          {children}
        </div>
        {footer && <div className="mock-modal-footer">{footer}</div>}
      </div>
    );
  };
});

describe('EducationSelector Component', () => {
  const mockOnChange = jest.fn();
  const initialEducation = [
    {
      degree: 'Master of Arts',
      institution: 'Sample University',
      fieldOfStudy: 'Literature',
      startYear: 2018,
      endYear: 2020,
      isCurrentlyStudying: false
    }
  ];
  
  it('renders with initial education entries', () => {
    render(
      <EducationSelector
        selectedEducation={initialEducation}
        onChange={mockOnChange}
      />
    );
    
    // Check if the component renders
    expect(screen.getByText('Education')).toBeInTheDocument();
    
    // Check if the initial education entry is displayed
    expect(screen.getByText('Master of Arts')).toBeInTheDocument();
    expect(screen.getByText('Sample University')).toBeInTheDocument();
    expect(screen.getByText('Literature')).toBeInTheDocument();
  });
}); 