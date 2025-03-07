import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCandidateForm from '../components/AddCandidateForm';

test('renders AddCandidateForm and submits data', () => {
  render(<AddCandidateForm />);
  const firstNameInput = screen.getByPlaceholderText(/Nombre/i);
  const lastNameInput = screen.getByPlaceholderText(/Apellido/i);
  const emailInput = screen.getByPlaceholderText(/Correo Electrónico/i);
  const submitButton = screen.getByText(/Añadir Candidato/i);

  fireEvent.change(firstNameInput, { target: { value: 'John' } });
  fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
  fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

  fireEvent.click(submitButton);

  expect(screen.getByText(/Candidato añadido exitosamente./i)).toBeInTheDocument();
});