// frontend/src/domain/candidate/AddCandidateForm/AddCandidateForm.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import AddCandidateForm from './AddCandidateForm';

describe('AddCandidateForm', () => {
  test('renders the form with name, email, and submit button', () => {
    const handleSubmit = jest.fn(); // Mock function for onSubmit
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('allows submitting the form with name and email', () => {
    const handleSubmit = jest.fn();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com' });
  });
});