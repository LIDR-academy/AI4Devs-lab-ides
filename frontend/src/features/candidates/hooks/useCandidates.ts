import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateService } from '../services/candidateService';
import { Candidate } from '../types';

// Claves para las consultas
const CANDIDATES_QUERY_KEY = 'candidates';
const CANDIDATE_QUERY_KEY = 'candidate';

/**
 * Hook para obtener todos los candidatos
 */
export const useGetCandidates = () => {
  return useQuery({
    queryKey: [CANDIDATES_QUERY_KEY],
    queryFn: async () => {
      try {
        const response = await candidateService.getCandidates();
        console.log('Respuesta completa de getCandidates:', response);
        
        if (response.success && response.data) {
          console.log('Datos de candidatos recibidos:');
          response.data.forEach((candidate, index) => {
            console.log(`Candidato ${index + 1}:`, {
              id: candidate.id,
              name: `${candidate.firstName} ${candidate.lastName}`,
              position: candidate.position,
              summary: candidate.summary,
              status: candidate.status
            });
          });
        }
        
        return response;
      } catch (error) {
        console.error('Error en useGetCandidates:', error);
        throw error;
      }
    },
  });
};

/**
 * Hook para obtener un candidato por su ID
 * @param id ID del candidato
 */
export const useGetCandidateById = (id: number) => {
  return useQuery({
    queryKey: [CANDIDATE_QUERY_KEY, id],
    queryFn: () => candidateService.getCandidateById(id),
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

/**
 * Hook para crear un candidato
 */
export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidate: Omit<Candidate, 'id'>) => {
      try {
        console.log('Enviando datos de candidato al servidor:', candidate);
        const response = await candidateService.createCandidate(candidate);
        console.log('Respuesta del servidor:', response);
        
        // Si la respuesta indica error, lanzar una excepción para que sea capturada por onError
        if (!response.success) {
          throw new Error(response.error || 'Error al crear el candidato');
        }
        
        return response;
      } catch (error: any) {
        console.error('Error en mutationFn de useCreateCandidate:', error);
        
        // Manejar específicamente errores de autenticación
        if (error.response && error.response.status === 401) {
          throw new Error('Necesita iniciar sesión para crear un candidato. Su sesión puede haber expirado.');
        } else if (error.response && error.response.status === 403) {
          throw new Error('No tiene permisos para crear candidatos. Contacte al administrador.');
        } else if (error.response && error.response.data && error.response.data.error) {
          throw new Error(error.response.data.error);
        }
        
        // Re-lanzar el error para que sea manejado por onError
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Candidato creado con éxito:', data);
      // Invalidar la consulta de candidatos para forzar una recarga
      queryClient.invalidateQueries({ queryKey: [CANDIDATES_QUERY_KEY] });
      return data;
    },
    onError: (error: any) => {
      console.error('Error al crear candidato en hook:', error);
      return error;
    }
  });
};

/**
 * Hook para actualizar un candidato
 */
export const useUpdateCandidate = (options?: { 
  onSuccess?: (data: any, variables: { id: number; candidate: Partial<Candidate> }) => void 
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, candidate }: { id: number; candidate: Partial<Candidate> }) => 
      candidateService.updateCandidate(id, candidate),
    onSuccess: (data, variables) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: [CANDIDATES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CANDIDATE_QUERY_KEY, variables.id] });
      
      // Llamar al callback personalizado si existe
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
  });
};

/**
 * Hook para eliminar un candidato
 */
export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => candidateService.deleteCandidate(id),
    onSuccess: () => {
      // Invalidar la consulta de candidatos para forzar una recarga
      queryClient.invalidateQueries({ queryKey: [CANDIDATES_QUERY_KEY] });
    },
  });
}; 