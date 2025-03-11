import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CandidateList from '../../../../features/candidates/components/CandidateList';
import { useGetCandidates, useDeleteCandidate } from '../../../../features/candidates/hooks/useCandidates';
import '@testing-library/jest-dom';

// Mock de los hooks
jest.mock('../../../../features/candidates/hooks/useCandidates', () => ({
  useGetCandidates: jest.fn(),
  useDeleteCandidate: jest.fn(),
}));

// Mock del hook de navegación
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('CandidateList Component - Integration Tests', () => {
  let queryClient: QueryClient;
  
  // Datos de prueba
  const mockCandidates = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      status: 'ACTIVE',
      position: 'Desarrollador Frontend',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      status: 'PENDING',
      position: 'Desarrollador Backend',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  // Mock de la función de eliminación
  const mockDeleteMutate = jest.fn();
  const mockDeleteMutateAsync = jest.fn();
  
  beforeEach(() => {
    // Crear un nuevo QueryClient para cada test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Configurar los mocks
    (useGetCandidates as jest.Mock).mockReturnValue({
      data: { success: true, data: mockCandidates },
      isLoading: false,
      isError: false,
      error: null,
    });
    
    (useDeleteCandidate as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      mutateAsync: mockDeleteMutateAsync,
      isLoading: false,
      isError: false,
      error: null,
    });
  });
  
  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CandidateList />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
  
  it('debería mostrar la lista de candidatos', async () => {
    // Arrange & Act
    renderComponent();
    
    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
  });
  
  it('debería mostrar el modal de confirmación al hacer clic en eliminar', async () => {
    // Arrange
    renderComponent();
    
    // Act - Buscar y hacer clic en el botón de eliminar del primer candidato
    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    
    // Assert
    expect(screen.getByText(/¿Estás seguro de que deseas eliminar/)).toBeInTheDocument();
    expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
  });
  
  it('debería llamar a la función de eliminación al confirmar', async () => {
    // Arrange
    mockDeleteMutateAsync.mockResolvedValue({ success: true });
    renderComponent();
    
    // Act - Hacer clic en eliminar y luego confirmar
    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    
    // Buscar el botón de confirmación en el modal
    const confirmButton = screen.getAllByText('Eliminar').find(
      button => button.closest('.bg-gray-50') !== null
    );
    
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }
    
    // Assert
    await waitFor(() => {
      expect(mockDeleteMutateAsync).toHaveBeenCalledWith(1);
    });
  });
  
  it('debería cerrar el modal al cancelar la eliminación', async () => {
    // Arrange
    renderComponent();
    
    // Act - Hacer clic en eliminar y luego cancelar
    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    // Assert
    await waitFor(() => {
      expect(screen.queryByText(/¿Estás seguro de que deseas eliminar/)).not.toBeInTheDocument();
    });
  });
  
  it('debería manejar errores al eliminar un candidato', async () => {
    // Arrange
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockDeleteMutateAsync.mockRejectedValue(new Error('Error al eliminar'));
    renderComponent();
    
    // Act - Hacer clic en eliminar y luego confirmar
    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    
    // Buscar el botón de confirmación en el modal
    const confirmButton = screen.getAllByText('Eliminar').find(
      button => button.closest('.bg-gray-50') !== null
    );
    
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }
    
    // Assert
    await waitFor(() => {
      expect(mockDeleteMutateAsync).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    // Restaurar el spy
    consoleErrorSpy.mockRestore();
  });
}); 