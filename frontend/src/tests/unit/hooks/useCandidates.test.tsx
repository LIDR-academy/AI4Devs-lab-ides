import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteCandidate, useCreateCandidate, useUpdateCandidate, useSearchSkills } from '../../../features/candidates/hooks/useCandidates';
import { candidateService } from '../../../features/candidates/services/candidateService';

// Mock del servicio de candidatos
jest.mock('../../../features/candidates/services/candidateService', () => ({
  candidateService: {
    deleteCandidate: jest.fn(),
    createCandidate: jest.fn(),
    updateCandidate: jest.fn(),
    searchSkills: jest.fn()
  }
}));

// Wrapper para los hooks que usan react-query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCandidates hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useDeleteCandidate', () => {
    it('debería llamar a deleteCandidate con el ID correcto', async () => {
      // Mock de la respuesta del servicio
      (candidateService.deleteCandidate as jest.Mock).mockResolvedValue({
        success: true,
        data: { message: 'Candidato eliminado correctamente' }
      });

      // Renderizar el hook
      const { result } = renderHook(() => useDeleteCandidate(), {
        wrapper: createWrapper(),
      });

      // Ejecutar la mutación
      await act(async () => {
        await result.current.mutateAsync(1);
      });

      // Verificar que se llamó al servicio con el ID correcto
      expect(candidateService.deleteCandidate).toHaveBeenCalledWith(1);
    });

    it('debería manejar errores correctamente', async () => {
      // Mock de la respuesta del servicio con error
      const error = new Error('Error al eliminar candidato');
      (candidateService.deleteCandidate as jest.Mock).mockRejectedValue(error);

      // Renderizar el hook
      const { result } = renderHook(() => useDeleteCandidate(), {
        wrapper: createWrapper(),
      });

      // Ejecutar la mutación y esperar que falle
      let caughtError;
      await act(async () => {
        try {
          await result.current.mutateAsync(1);
        } catch (e) {
          caughtError = e;
        }
      });

      // Verificar que se capturó el error
      expect(caughtError).toBe(error);
      expect(candidateService.deleteCandidate).toHaveBeenCalledWith(1);
    });

    it('debería invalidar la consulta de candidatos después de una eliminación exitosa', async () => {
      // Mock de la respuesta del servicio
      (candidateService.deleteCandidate as jest.Mock).mockResolvedValue({
        success: true,
        data: { message: 'Candidato eliminado correctamente' }
      });

      // Crear un cliente de consulta con un método de invalidación espía
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      // Renderizar el hook con el cliente de consulta personalizado
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
      const { result } = renderHook(() => useDeleteCandidate(), { wrapper });

      // Ejecutar la mutación
      await act(async () => {
        await result.current.mutateAsync(1);
      });

      // Verificar que se invalidó la consulta de candidatos
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['candidates'] });
    });
  });

  describe('useCreateCandidate', () => {
    it('debería llamar a createCandidate con los datos correctos', async () => {
      // Mock de la respuesta del servicio
      (candidateService.createCandidate as jest.Mock).mockResolvedValue({
        success: true,
        data: { 
          id: 1, 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john.doe@example.com' 
        }
      });

      // Datos del candidato para la prueba
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        skills: [{ name: 'JavaScript', level: 'intermediate' }],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Renderizar el hook
      const { result } = renderHook(() => useCreateCandidate(), {
        wrapper: createWrapper(),
      });

      // Ejecutar la mutación
      await act(async () => {
        await result.current.mutateAsync(candidateData as any);
      });

      // Verificar que se llamó al servicio con los datos correctos
      expect(candidateService.createCandidate).toHaveBeenCalledWith(candidateData);
    });

    it('debería manejar errores correctamente', async () => {
      // Mock de la respuesta del servicio con error
      const error = new Error('Error al crear candidato');
      (candidateService.createCandidate as jest.Mock).mockRejectedValue(error);

      // Datos del candidato para la prueba
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Renderizar el hook
      const { result } = renderHook(() => useCreateCandidate(), {
        wrapper: createWrapper(),
      });

      // Ejecutar la mutación y esperar que falle
      let caughtError;
      await act(async () => {
        try {
          await result.current.mutateAsync(candidateData as any);
        } catch (e) {
          caughtError = e;
        }
      });

      // Verificar que se capturó el error
      expect(caughtError).toBe(error);
      expect(candidateService.createCandidate).toHaveBeenCalledWith(candidateData);
    });

    it('debería invalidar la consulta de candidatos después de una creación exitosa', async () => {
      // Mock de la respuesta del servicio
      (candidateService.createCandidate as jest.Mock).mockResolvedValue({
        success: true,
        data: { 
          id: 1, 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john.doe@example.com' 
        }
      });

      // Datos del candidato para la prueba
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Crear un cliente de consulta con un método de invalidación espía
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      // Renderizar el hook con el cliente de consulta personalizado
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
      const { result } = renderHook(() => useCreateCandidate(), { wrapper });

      // Ejecutar la mutación
      await act(async () => {
        await result.current.mutateAsync(candidateData as any);
      });

      // Verificar que se invalidó la consulta de candidatos
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['candidates'] });
    });
  });

  describe('useUpdateCandidate', () => {
    it('debería llamar a updateCandidate con el ID y los datos correctos', async () => {
      // Mock de la respuesta del servicio
      (candidateService.updateCandidate as jest.Mock).mockResolvedValue({
        success: true,
        data: { 
          id: 1, 
          firstName: 'John Updated', 
          lastName: 'Doe Updated', 
          email: 'john.updated@example.com' 
        }
      });

      // Datos del candidato para la prueba
      const candidateId = 1;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com',
        skills: [{ name: 'JavaScript', level: 'advanced' }]
      };

      // Renderizar el hook
      const { result } = renderHook(() => useUpdateCandidate(), {
        wrapper: createWrapper(),
      });

      // Ejecutar la mutación
      await act(async () => {
        await result.current.mutateAsync({ id: candidateId, candidate: updateData as any });
      });

      // Verificar que se llamó al servicio con los datos correctos
      expect(candidateService.updateCandidate).toHaveBeenCalledWith(candidateId, updateData);
    });

    it('debería manejar errores correctamente', async () => {
      // Mock de la respuesta del servicio con error
      const error = new Error('Error al actualizar candidato');
      (candidateService.updateCandidate as jest.Mock).mockRejectedValue(error);

      // Datos del candidato para la prueba
      const candidateId = 1;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com'
      };

      // Renderizar el hook
      const { result } = renderHook(() => useUpdateCandidate(), {
        wrapper: createWrapper(),
      });

      // Ejecutar la mutación y esperar que falle
      let caughtError;
      await act(async () => {
        try {
          await result.current.mutateAsync({ id: candidateId, candidate: updateData as any });
        } catch (e) {
          caughtError = e;
        }
      });

      // Verificar que se capturó el error
      expect(caughtError).toBe(error);
      expect(candidateService.updateCandidate).toHaveBeenCalledWith(candidateId, updateData);
    });

    it('debería invalidar la consulta de candidatos después de una actualización exitosa', async () => {
      // Mock de la respuesta del servicio
      (candidateService.updateCandidate as jest.Mock).mockResolvedValue({
        success: true,
        data: { 
          id: 1, 
          firstName: 'John Updated', 
          lastName: 'Doe Updated', 
          email: 'john.updated@example.com' 
        }
      });

      // Datos del candidato para la prueba
      const candidateId = 1;
      const updateData = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        email: 'john.updated@example.com'
      };

      // Crear un cliente de consulta con un método de invalidación espía
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

      // Renderizar el hook con el cliente de consulta personalizado
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
      const { result } = renderHook(() => useUpdateCandidate(), { wrapper });

      // Ejecutar la mutación
      await act(async () => {
        await result.current.mutateAsync({ id: candidateId, candidate: updateData as any });
      });

      // Verificar que se invalidó la consulta de candidatos
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['candidates'] });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['candidate', candidateId] });
    });
  });

  describe('useSearchSkills', () => {
    it('should return skills matching the query', async () => {
      // Arrange
      const mockSkills = ['JavaScript', 'Java', 'Java Spring'];
      (candidateService.searchSkills as jest.Mock).mockResolvedValue({
        success: true,
        data: mockSkills
      });

      // Act
      const { result } = renderHook(() => useSearchSkills());
      let skills: string[] = [];
      
      await act(async () => {
        skills = await result.current.searchSkills('jav');
      });

      // Assert
      expect(candidateService.searchSkills).toHaveBeenCalledWith('jav');
      expect(skills).toEqual(mockSkills);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return empty array for empty query', async () => {
      // Arrange
      (candidateService.searchSkills as jest.Mock).mockResolvedValue({
        success: true,
        data: []
      });

      // Act
      const { result } = renderHook(() => useSearchSkills());
      let skills: string[] = [];
      
      await act(async () => {
        skills = await result.current.searchSkills('');
      });

      // Assert
      expect(candidateService.searchSkills).toHaveBeenCalledWith('');
      expect(skills).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle API errors', async () => {
      // Arrange
      const errorMessage = 'Error al buscar habilidades';
      (candidateService.searchSkills as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage
      });

      // Act
      const { result } = renderHook(() => useSearchSkills());
      let skills: string[] = [];
      
      await act(async () => {
        skills = await result.current.searchSkills('jav');
      });

      // Assert
      expect(candidateService.searchSkills).toHaveBeenCalledWith('jav');
      expect(skills).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should handle exceptions', async () => {
      // Arrange
      const errorMessage = 'Network Error';
      (candidateService.searchSkills as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useSearchSkills());
      let skills: string[] = [];
      
      await act(async () => {
        skills = await result.current.searchSkills('jav');
      });

      // Assert
      expect(candidateService.searchSkills).toHaveBeenCalledWith('jav');
      expect(skills).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it('should set isLoading to true while fetching', async () => {
      // Mock the searchSkills function to return a promise that doesn't resolve immediately
      const searchSkillsMock = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(['JavaScript', 'Java', 'Java Spring']);
          }, 100);
        });
      });
      
      // Mock the candidateService
      (candidateService.searchSkills as jest.Mock).mockImplementation(searchSkillsMock);
      
      let promise: Promise<any>;
      
      const { result } = renderHook(() => useSearchSkills());
      
      act(() => {
        // Start the search
        promise = result.current.searchSkills('jav');
        
        // We can't check isLoading synchronously because React 18's batching
        // The state update might not be reflected immediately
      });
      
      // Wait for the loading state to be set to true
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
      
      // Wait for the promise to resolve
      await act(async () => {
        await promise;
      });
      
      // After the promise resolves, isLoading should be false
      expect(result.current.isLoading).toBe(false);
    });
  });
}); 