import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CandidateEdit from '../../../../features/candidates/components/CandidateEdit';
import { candidateService } from '../../../../features/candidates/services/candidateService';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '1' }),
}));

// Mock del servicio de candidatos
jest.mock('../../../../features/candidates/services/candidateService', () => ({
  candidateService: {
    getCandidateById: jest.fn(),
    updateCandidate: jest.fn(),
  },
}));

describe('CandidateEdit Component - Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Crear un nuevo QueryClient para cada test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Resetear todos los mocks
    jest.clearAllMocks();

    // Mock de la respuesta del servicio para getCandidateById
    (candidateService.getCandidateById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        skills: ['JavaScript', 'React', 'Node.js'],
        education: [],
        workExperience: []
      }
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<CandidateEdit />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('debería cargar los datos del candidato correctamente', async () => {
    renderComponent();

    // Verificar que se muestra el spinner de carga inicialmente
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
    });

    // Verificar que se llamó al servicio para obtener los datos
    expect(candidateService.getCandidateById).toHaveBeenCalledWith(1);
  });

  it('debería actualizar un candidato correctamente', async () => {
    // Mock de la respuesta del servicio para updateCandidate
    (candidateService.updateCandidate as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 1,
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        phone: '987654321'
      }
    });

    renderComponent();

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    // Modificar los campos
    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    const phoneInput = screen.getByDisplayValue('123456789');

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'John Updated');
    
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'Doe Updated');
    
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'john.updated@example.com');
    
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '987654321');

    // Enviar el formulario
    const submitButton = screen.getByText(/guardar/i);
    fireEvent.click(submitButton);

    // Verificar que se llamó al servicio con los datos correctos
    await waitFor(() => {
      expect(candidateService.updateCandidate).toHaveBeenCalledWith(1, expect.objectContaining({
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        phone: '987654321'
      }));
    });
  });

  it('debería manejar errores al cargar los datos del candidato', async () => {
    // Mock de la respuesta del servicio con error
    (candidateService.getCandidateById as jest.Mock).mockRejectedValue(new Error('Error al cargar candidato'));

    renderComponent();

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/no se pudo cargar la información del candidato/i)).toBeInTheDocument();
    });
  });

  it('debería manejar errores al actualizar un candidato', async () => {
    // Mock de la respuesta del servicio para updateCandidate con error
    (candidateService.updateCandidate as jest.Mock).mockRejectedValue({
      response: {
        data: {
          error: 'Ya existe un candidato con ese email'
        }
      }
    });

    renderComponent();

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    // Modificar los campos
    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'existing@example.com');

    // Enviar el formulario
    const submitButton = screen.getByText(/guardar/i);
    fireEvent.click(submitButton);

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/ya existe un candidato con ese email/i)).toBeInTheDocument();
    });
  });
}); 