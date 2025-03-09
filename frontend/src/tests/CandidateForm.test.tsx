import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CandidateForm from '../components/candidates/CandidateForm';
import * as candidateService from '../services/candidateService';

// Mock del servicio de candidatos
jest.mock('../services/candidateService');

describe('CandidateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario correctamente', () => {
    render(<CandidateForm />);
    
    // Verificar que los campos obligatorios están presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    // Verificar que los campos opcionales están presentes
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/educación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/experiencia laboral/i)).toBeInTheDocument();
    
    // Verificar que el componente de carga de archivos está presente
    expect(screen.getByText(/cv \(pdf o docx, máx. 5mb\)/i)).toBeInTheDocument();
    
    // Verificar que los botones están presentes
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir candidato/i })).toBeInTheDocument();
  });

  test('muestra errores de validación para campos obligatorios', async () => {
    render(<CandidateForm />);
    
    // Hacer clic en el botón de enviar sin completar campos obligatorios
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que se muestran mensajes de error para campos obligatorios
    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
    });
    
    // Verificar que no se llamó al servicio
    expect(candidateService.createCandidate).not.toHaveBeenCalled();
  });

  test('valida el formato del email', async () => {
    render(<CandidateForm />);
    
    // Completar campos obligatorios con email inválido
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juanperez@com' } });
    
    // Hacer clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que se muestra mensaje de error para email inválido
    await waitFor(() => {
      expect(screen.getByText(/el formato del email no es válido/i)).toBeInTheDocument();
    });
    
    // Verificar que no se llamó al servicio
    expect(candidateService.createCandidate).not.toHaveBeenCalled();
  });

  test('envía el formulario correctamente con datos válidos', async () => {
    // Mock de la respuesta del servicio
    const mockResponse = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34612345678',
      address: 'Calle Principal 123',
      education: 'Ingeniería Informática',
      workExperience: '5 años como desarrollador',
      cvUrl: null,
      cvFileName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    (candidateService.createCandidate as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<CandidateForm />);
    
    // Completar campos obligatorios
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan.perez@example.com' } });
    
    // Completar campos opcionales
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '+34612345678' } });
    fireEvent.change(screen.getByLabelText(/dirección/i), { target: { value: 'Calle Principal 123' } });
    fireEvent.change(screen.getByLabelText(/educación/i), { target: { value: 'Ingeniería Informática' } });
    fireEvent.change(screen.getByLabelText(/experiencia laboral/i), { target: { value: '5 años como desarrollador' } });
    
    // Hacer clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que se llamó al servicio con los datos correctos
    await waitFor(() => {
      expect(candidateService.createCandidate).toHaveBeenCalled();
      
      // Verificar que se muestra mensaje de éxito
      expect(screen.getByText(/candidato añadido correctamente/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje de error cuando falla la creación', async () => {
    // Mock del servicio para lanzar error
    const errorMessage = 'Ya existe un candidato con este email';
    (candidateService.createCandidate as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    render(<CandidateForm />);
    
    // Completar campos obligatorios
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan.perez@example.com' } });
    
    // Hacer clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que se muestra mensaje de error
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('limpia el formulario después de enviar correctamente', async () => {
    // Mock de la respuesta del servicio
    const mockResponse = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    (candidateService.createCandidate as jest.Mock).mockResolvedValue(mockResponse);
    
    render(<CandidateForm />);
    
    // Completar campos obligatorios
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan.perez@example.com' } });
    
    // Hacer clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que los campos se limpian después de enviar
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });
  });

  // Pruebas adicionales para el modo de edición
  test('carga datos del candidato en modo edición', async () => {
    // Mock de la respuesta del servicio
    const mockCandidate = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34612345678',
      address: 'Calle Principal 123',
      education: 'Ingeniería Informática',
      workExperience: '5 años como desarrollador',
      cvUrl: null,
      cvFileName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    (candidateService.getCandidateById as jest.Mock).mockResolvedValue(mockCandidate);
    
    render(<CandidateForm candidateId={1} />);
    
    // Verificar que se cargan los datos del candidato
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('Juan');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('Pérez');
      expect(screen.getByLabelText(/email/i)).toHaveValue('juan.perez@example.com');
      expect(screen.getByLabelText(/teléfono/i)).toHaveValue('+34612345678');
      expect(screen.getByLabelText(/dirección/i)).toHaveValue('Calle Principal 123');
      expect(screen.getByLabelText(/educación/i)).toHaveValue('Ingeniería Informática');
      expect(screen.getByLabelText(/experiencia laboral/i)).toHaveValue('5 años como desarrollador');
    });
    
    // Verificar que el botón dice "Actualizar Candidato" en lugar de "Añadir Candidato"
    expect(screen.getByRole('button', { name: /actualizar candidato/i })).toBeInTheDocument();
  });
}); 