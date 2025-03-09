import api from './api';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: string | null;
  workExperience: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Crear un nuevo candidato
 * @param data FormData con los datos del candidato y el CV
 * @returns El candidato creado
 */
export const createCandidate = async (data: FormData): Promise<Candidate> => {
  try {
    const response = await api.post('/candidates', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Error al crear el candidato');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Error al crear el candidato');
    }
    throw error;
  }
};

/**
 * Obtener todos los candidatos
 * @returns Lista de candidatos
 */
export const getAllCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await api.get('/candidates');
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Error al obtener los candidatos');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Error al obtener los candidatos');
    }
    throw error;
  }
};

/**
 * Obtener un candidato por su ID
 * @param id ID del candidato
 * @returns El candidato encontrado
 */
export const getCandidateById = async (id: number): Promise<Candidate> => {
  try {
    const response = await api.get(`/candidates/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Error al obtener el candidato');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Error al obtener el candidato');
    }
    throw error;
  }
};

/**
 * Actualizar un candidato
 * @param id ID del candidato
 * @param data FormData con los datos actualizados y el CV
 * @returns El candidato actualizado
 */
export const updateCandidate = async (id: number, data: FormData): Promise<Candidate> => {
  try {
    const response = await api.put(`/candidates/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error?.message || 'Error al actualizar el candidato');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Error al actualizar el candidato');
    }
    throw error;
  }
};

/**
 * Eliminar un candidato
 * @param id ID del candidato
 * @returns Mensaje de confirmación
 */
export const deleteCandidate = async (id: number): Promise<string> => {
  try {
    const response = await api.delete(`/candidates/${id}`);
    
    if (response.data.success) {
      return response.data.message;
    } else {
      throw new Error(response.data.error?.message || 'Error al eliminar el candidato');
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Error al eliminar el candidato');
    }
    throw error;
  }
}; 