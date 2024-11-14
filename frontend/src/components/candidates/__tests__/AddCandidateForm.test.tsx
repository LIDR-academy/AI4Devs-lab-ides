import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCandidateForm } from '../AddCandidateForm';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('AddCandidateForm', () => {
  beforeEach(() => {
    render(<AddCandidateForm />);
  });

  test('envía el formulario correctamente con datos válidos', async () => {
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
    
    const submitButton = screen.getByText('Añadir Candidato');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument();
      expect(screen.queryByText('El apellido es obligatorio')).not.toBeInTheDocument();
      expect(screen.queryByText('El email es obligatorio')).not.toBeInTheDocument();
    });
  });

  test('muestra mensaje de error cuando los campos obligatorios están vacíos', async () => {
    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /añadir candidato/i });
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
      expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
    });
  });

  test('valida el formato del email', async () => {
    await act(async () => {
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      await userEvent.type(emailInput, 'email-invalido');
      
      const submitButton = screen.getByRole('button', { name: /añadir candidato/i });
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });
  });

  test('valida el formato del teléfono cuando se proporciona', async () => {
    await act(async () => {
      const phoneInput = screen.getByLabelText(/teléfono/i);
      await userEvent.type(phoneInput, '123');
      
      const submitButton = screen.getByRole('button', { name: /añadir candidato/i });
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Formato de teléfono inválido')).toBeInTheDocument();
    });
  });

  test('permite añadir múltiples entradas de educación', async () => {
    await act(async () => {
      const addEducationButton = screen.getByRole('button', { name: /añadir educación/i });
      await userEvent.click(addEducationButton);
    });
    
    const educationInputs = screen.getAllByLabelText(/institución educativa/i);
    expect(educationInputs).toHaveLength(2);
  });

  test('permite añadir múltiples experiencias laborales', async () => {
    await act(async () => {
      const addExperienceButton = screen.getByRole('button', { name: /añadir experiencia/i });
      await userEvent.click(addExperienceButton);
    });
    
    const companyInputs = screen.getAllByLabelText(/empresa/i);
    expect(companyInputs).toHaveLength(2);
  });

  test('permite subir un archivo PDF', async () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    await act(async () => {
      const fileInput = screen.getByLabelText(/subir cv/i);
      await userEvent.upload(fileInput, file);
    });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });
}); 