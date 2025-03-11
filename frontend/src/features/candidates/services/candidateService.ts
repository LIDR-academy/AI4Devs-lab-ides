import axios from 'axios';
import { Candidate, CandidateResponse, CandidatesResponse } from '../types';
import api from '../../auth/services/authService';

// Configuración de axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

// Nota: Ya no usamos apiCandidate, usamos la instancia api que tiene los interceptores de autenticación
// Eliminamos esta instancia y usamos la importada de authService
// const apiCandidate = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Importante para manejar cookies
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

export const candidateService = {
  /**
   * Obtiene todos los candidatos
   * @returns Respuesta con la lista de candidatos
   */
  async getCandidates(): Promise<CandidatesResponse> {
    try {
      const response = await api.get<CandidatesResponse>('/api/candidates');
      console.log('Respuesta original del backend (getCandidates):', response.data);
      
      // Asegurarse de que todos los candidatos tengan los campos necesarios
      if (response.data.success && response.data.data) {
        response.data.data = response.data.data.map(candidate => {
          console.log('Procesando candidato:', candidate.id, candidate.firstName, candidate.lastName);
          console.log('Estado original del candidato:', candidate.status);
          
          // Determinar si education es un string o un array
          let educationText = '';
          let educationArray: any[] = [];
          
          if (candidate.education) {
            if (typeof candidate.education === 'string') {
              educationText = candidate.education as string;
              // Eliminar education si es un string para evitar problemas de tipo
              delete (candidate as any).education;
            } else if (Array.isArray(candidate.education)) {
              educationArray = candidate.education;
            }
          }
          
          // Validar el estado del candidato
          let validStatus = candidate.status;
          const validStatuses = ['new', 'active', 'contacted', 'interview', 'offer', 'hired', 'rejected'];
          if (!validStatus || !validStatuses.includes(validStatus.toLowerCase())) {
            validStatus = 'active'; // Valor por defecto si el estado no es válido
          }
          
          // Crear un nuevo objeto con los campos correctos
          const processedCandidate = {
            id: candidate.id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone || '',
            status: validStatus,
            position: candidate.position || this.extractPositionFromText(candidate.summary || candidate.notes || ''),
            summary: candidate.summary || candidate.notes || '',
            experience: candidate.experience || 0,
            education: educationArray,
            educationText: educationText,
            notes: candidate.notes || '',
            skills: candidate.skills || [],
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt,
            workExperience: candidate.workExperience || []
          };
          
          console.log('Candidato procesado:', processedCandidate);
          console.log('Estado procesado del candidato:', processedCandidate.status);
          return processedCandidate as any;
        });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error en getCandidates:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener candidatos',
      };
    }
  },

  /**
   * Extrae la posición de un texto
   * @param text Texto del que extraer la posición
   * @returns Posición extraída o 'No especificada'
   */
  extractPositionFromText(text: string): string {
    if (!text) return 'No especificada';
    
    console.log('Extrayendo posición de texto:', text);
    
    // Buscar la posición en el formato "Posición: X"
    const positionMatch = text.match(/Posición: ([^,\n]+)/);
    if (positionMatch && positionMatch[1]) {
      const position = positionMatch[1].trim();
      console.log('Posición extraída:', position);
      return position;
    }
    
    return 'No especificada';
  },

  /**
   * Obtiene un candidato por su ID
   * @param id ID del candidato
   * @returns Respuesta con los datos del candidato
   */
  async getCandidateById(id: number): Promise<CandidateResponse> {
    try {
      const response = await api.get<CandidateResponse>(`/api/candidates/${id}`);
      console.log('Respuesta original del backend (getCandidateById):', response.data);
      
      // Asegurarse de que el candidato tenga todos los campos necesarios
      if (response.data.success && response.data.data) {
        // Procesar el candidato para asegurarse de que tenga todos los campos necesarios
        const processedCandidate = {
          ...response.data.data,
          // Si no tiene position, extraerla del summary o usar un valor por defecto
          position: response.data.data.position || (response.data.data.summary ? this.extractPositionFromSummary(response.data.data.summary) : 'No especificada'),
          // Si no tiene summary, crearlo a partir de los datos disponibles
          summary: response.data.data.summary || `Posición: ${response.data.data.position || 'No especificada'}${response.data.data.experience ? `, Experiencia: ${response.data.data.experience} años` : ''}${response.data.data.education ? `, Educación: ${response.data.data.education}` : ''}`,
          // Si no tiene status, usar 'active'
          status: response.data.data.status || 'active',
          // Asegurarse de que otros campos tengan valores por defecto si son undefined
          experience: response.data.data.experience || 0,
          education: response.data.data.education || '',
          notes: response.data.data.notes || '',
          skills: response.data.data.skills || [],
        };
        
        response.data.data = processedCandidate;
        console.log('Candidato procesado:', processedCandidate);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error en getCandidateById:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener el candidato',
      };
    }
  },

  /**
   * Crea un nuevo candidato
   * @param candidate Datos del candidato
   * @returns Respuesta con los datos del candidato creado
   */
  async createCandidate(candidate: any): Promise<CandidateResponse> {
    try {
      console.log('Datos recibidos para crear candidato:', candidate);
      
      // Verificar si education y workExperience son arrays
      const hasEducationArray = Array.isArray(candidate.education);
      const hasWorkExperienceArray = Array.isArray(candidate.workExperience);
      
      // Procesar los datos de educación para convertir las fechas a strings
      let educationData = [];
      if (hasEducationArray) {
        educationData = candidate.education.map((edu: any) => ({
          ...edu,
          startDate: typeof edu.startDate === 'object' ? edu.startDate.toISOString().split('T')[0] : edu.startDate,
          endDate: edu.endDate ? (typeof edu.endDate === 'object' ? edu.endDate.toISOString().split('T')[0] : edu.endDate) : undefined
        }));
      }
      
      // Procesar los datos de experiencia laboral para convertir las fechas a strings
      let workExperienceData = [];
      if (hasWorkExperienceArray) {
        workExperienceData = candidate.workExperience.map((exp: any) => ({
          ...exp,
          startDate: typeof exp.startDate === 'object' ? exp.startDate.toISOString().split('T')[0] : exp.startDate,
          endDate: exp.endDate ? (typeof exp.endDate === 'object' ? exp.endDate.toISOString().split('T')[0] : exp.endDate) : undefined
        }));
      }
      
      // Crear el objeto de candidato con todos los campos necesarios
      const adaptedCandidate = {
        firstName: candidate.firstName.trim(),
        lastName: candidate.lastName.trim(),
        email: candidate.email.trim(),
        phone: candidate.phone?.trim() || '',
        status: candidate.status || 'active',
        notes: candidate.notes?.trim() || '',
        dataConsent: true,
        // Usar los datos procesados
        education: educationData,
        workExperience: workExperienceData,
        skills: candidate.skills || []
      };
      
      console.log('Enviando datos completos al backend:', JSON.stringify(adaptedCandidate, null, 2));
      
      const response = await api.post<CandidateResponse>('/api/candidates', adaptedCandidate);
      console.log('Respuesta del backend:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error: any) {
      console.error('Error en createCandidate:', error);
      
      // Mostrar detalles del error para depuración
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      return {
        success: false,
        error: error.response?.data?.error || 'Error al crear el candidato',
      };
    }
  },

  /**
   * Extrae la posición del campo summary
   * @param summary Texto del campo summary
   * @returns Posición extraída o 'No especificada'
   */
  extractPositionFromSummary(summary: string): string {
    if (!summary) return 'No especificada';
    
    console.log('Extrayendo posición de summary en servicio:', summary);
    
    // Buscar la posición en el formato "Posición: X"
    const positionMatch = summary.match(/Posición: ([^,]+)/);
    if (positionMatch && positionMatch[1]) {
      const position = positionMatch[1].trim();
      console.log('Posición extraída en servicio:', position);
      return position;
    }
    
    return 'No especificada';
  },

  /**
   * Actualiza un candidato existente
   * @param id ID del candidato
   * @param candidate Datos actualizados del candidato
   * @returns Respuesta con los datos del candidato actualizado
   */
  async updateCandidate(id: number, candidate: Partial<Candidate>): Promise<CandidateResponse> {
    try {
      const response = await api.put<CandidateResponse>(`/api/candidates/${id}`, candidate);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar el candidato',
      };
    }
  },

  /**
   * Elimina un candidato
   * @param id ID del candidato
   * @returns Respuesta indicando si se eliminó correctamente
   */
  async deleteCandidate(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.delete(`/api/candidates/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al eliminar el candidato',
      };
    }
  },

  /**
   * Sube un documento para un candidato
   * @param candidateId ID del candidato
   * @param formData Datos del formulario con el documento
   * @returns Respuesta con el resultado de la operación
   */
  async uploadDocument(candidateId: number, formData: FormData): Promise<any> {
    try {
      console.log('Subiendo documento para el candidato:', candidateId);
      
      const response = await api.post(`/api/candidates/${candidateId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Respuesta de la subida de documento:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error al subir documento:', error);
      
      if (error.response) {
        console.error('Datos de la respuesta de error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        
        return {
          success: false,
          error: error.response.data?.error || 'Error al subir el documento',
        };
      }
      
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },

  /**
   * Obtiene los documentos de un candidato
   * @param candidateId ID del candidato
   * @returns Respuesta con la lista de documentos
   */
  async getCandidateDocuments(candidateId: number): Promise<any> {
    try {
      console.log('Obteniendo documentos del candidato:', candidateId);
      
      // Asegurarnos de que estamos usando la instancia de axios con los interceptores de autenticación
      const response = await api.get(`/api/candidates/${candidateId}/documents`);
      
      console.log('Respuesta de la obtención de documentos:', response.data);
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error: any) {
      console.error('Error al obtener documentos:', error);
      
      if (error.response) {
        console.error('Datos de la respuesta de error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        
        // Manejar específicamente errores de autenticación
        if (error.response.status === 401) {
          return {
            success: false,
            error: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
          };
        }
        
        return {
          success: false,
          error: error.response.data?.error || 'Error al obtener los documentos',
        };
      }
      
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },

  /**
   * Elimina un documento
   * @param documentId ID del documento a eliminar
   * @returns Respuesta con el resultado de la operación
   */
  async deleteDocument(documentId: number): Promise<any> {
    try {
      console.log('Eliminando documento:', documentId);
      
      const response = await api.delete(`/api/documents/${documentId}`);
      
      console.log('Respuesta de la eliminación de documento:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error al eliminar documento:', error);
      
      if (error.response) {
        console.error('Datos de la respuesta de error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        
        return {
          success: false,
          error: error.response.data?.error || 'Error al eliminar el documento',
        };
      }
      
      return {
        success: false,
        error: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
      };
    }
  },

  /**
   * Busca habilidades que coincidan con un término de búsqueda
   * @param query Término de búsqueda
   * @returns Respuesta con la lista de habilidades
   */
  async searchSkills(query: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      if (!query || query.trim().length === 0) {
        return { success: true, data: [] };
      }

      const response = await api.get(`/api/candidates/skills/search?query=${encodeURIComponent(query)}`);
      console.log('Respuesta de búsqueda de habilidades:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error al buscar habilidades:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al buscar habilidades'
      };
    }
  },
}; 