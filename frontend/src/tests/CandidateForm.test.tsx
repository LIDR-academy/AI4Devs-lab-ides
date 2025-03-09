import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CandidateForm from '../components/candidate/CandidateForm';
import { candidateService } from '../services/api';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  candidateService: {
    createCandidate: jest.fn(),
  },
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('CandidateForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with all required fields', () => {
    render(
      <BrowserRouter>
        <CandidateForm />
      </BrowserRouter>
    );

    // Verificar que los campos principales estén presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    
    // Verificar que los botones estén presentes
    expect(screen.getByText(/añadir educación/i)).toBeInTheDocument();
    expect(screen.getByText(/añadir experiencia/i)).toBeInTheDocument();
    expect(screen.getByText(/guardar candidato/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(
      <BrowserRouter>
        <CandidateForm />
      </BrowserRouter>
    );

    // Enviar el formulario vacío
    fireEvent.click(screen.getByText(/guardar candidato/i));

    // Verificar que aparezcan mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
      expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/la dirección es obligatoria/i)).toBeInTheDocument();
    });
  });

  // Más pruebas se pueden agregar aquí para probar la funcionalidad completa del formulario
}); 