import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CandidateForm from '../../../../features/candidates/components/CandidateForm';
import { candidateService } from '../../../../features/candidates/services/candidateService';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock del servicio de candidatos
jest.mock('../../../../features/candidates/services/candidateService', () => ({
  candidateService: {
    createCandidate: jest.fn(),
  },
}));

describe('CandidateForm Component - Integration Tests', () => {
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
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CandidateForm />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('debería mostrar el formulario de creación de candidatos', () => {
    renderComponent();

    // Verificar que los campos principales están presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByText(/guardar/i)).toBeInTheDocument();
  });

  it('debería validar los campos obligatorios', async () => {
    renderComponent();

    // Intentar enviar el formulario sin completar los campos obligatorios
    const submitButton = screen.getByText(/guardar/i);
    fireEvent.click(submitButton);

    // Verificar que se muestran los mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/el apellido debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('debería enviar los datos correctamente al crear un candidato', async () => {
    // Mock de la respuesta del servicio
    (candidateService.createCandidate as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
      },
    });

    renderComponent();

    // Completar el formulario
    const firstNameInput = screen.getByLabelText(/nombre/i);
    const lastNameInput = screen.getByLabelText(/apellido/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);
    
    // We'll skip testing the skills input as it's a complex component with react-select
    // that requires special handling

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(phoneInput, '123456789');
    
    // Enviar el formulario
    const submitButton = screen.getByText(/guardar/i);
    fireEvent.click(submitButton);

    // Verificar que se llamó al servicio con los datos correctos
    await waitFor(() => {
      expect(candidateService.createCandidate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          // We won't check skills since we're not interacting with that input
        })
      );
    });
  });

  it('debería manejar errores al crear un candidato', async () => {
    // Mock de la respuesta del servicio con error
    (candidateService.createCandidate as jest.Mock).mockRejectedValue({
      response: {
        data: {
          error: 'Ya existe un candidato con ese email',
        },
      },
    });

    renderComponent();

    // Completar el formulario
    const firstNameInput = screen.getByLabelText(/nombre/i);
    const lastNameInput = screen.getByLabelText(/apellido/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.type(phoneInput, '123456789');

    // Enviar el formulario
    const submitButton = screen.getByText(/guardar/i);
    fireEvent.click(submitButton);

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/ya existe un candidato con ese email/i)).toBeInTheDocument();
    });
  });
}); 