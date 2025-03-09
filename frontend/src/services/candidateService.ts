import { Candidate, CandidateApiResponse, CandidateFormData } from '../types/Candidate';

/**
 * URL base para las operaciones de la API de candidatos
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

/**
 * Servicio para manejar las operaciones relacionadas con candidatos
 */
export const candidateService = {
  /**
   * Crea un nuevo candidato en el sistema
   * @param candidateData Datos del candidato a crear
   * @returns Respuesta de la API
   */
  async createCandidate(candidateData: CandidateFormData): Promise<CandidateApiResponse> {
    try {
      // Crear un objeto FormData para enviar los datos al backend
      const formData = new FormData();
      
      // Añadir los datos básicos
      formData.append('firstName', candidateData.firstName);
      formData.append('lastName', candidateData.lastName);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('address', candidateData.address);
      
      // Procesar la educación para asegurar que las fechas sean válidas
      const processedEducation = candidateData.education.map(edu => ({
        ...edu,
        // Asegurarse de que startDate sea una cadena no vacía
        startDate: edu.startDate || '',
        // Si endDate es null, mantenerlo como null, de lo contrario asegurarse de que sea una cadena no vacía
        endDate: edu.endDate === null ? null : (edu.endDate || '')
      }));
      
      // Procesar la experiencia laboral para asegurar que las fechas sean válidas
      const processedWorkExperience = candidateData.workExperience.map(exp => ({
        ...exp,
        // Asegurarse de que startDate sea una cadena no vacía
        startDate: exp.startDate || '',
        // Si endDate es null, mantenerlo como null, de lo contrario asegurarse de que sea una cadena no vacía
        endDate: exp.endDate === null ? null : (exp.endDate || '')
      }));
      
      // Añadir la educación y experiencia como JSON
      formData.append('education', JSON.stringify(processedEducation));
      formData.append('workExperience', JSON.stringify(processedWorkExperience));
      
      // Añadir el archivo CV si existe
      if (candidateData.cvFile) {
        formData.append('cvFile', candidateData.cvFile);
      }
      
      // Enviar la solicitud al backend
      const response = await fetch(`${API_URL}/candidates`, {
        method: 'POST',
        body: formData,
        // No incluimos Content-Type ya que FormData lo establece automáticamente con el boundary
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear candidato:', error);
      return {
        success: false,
        message: 'Error al crear el candidato. Por favor, inténtelo de nuevo.',
        errors: {
          general: ['Ocurrió un error al procesar la solicitud']
        }
      };
    }
  },
  
  /**
   * Obtiene un candidato por su ID
   * @param id ID del candidato
   * @returns Respuesta de la API
   */
  async getCandidateById(id: string): Promise<CandidateApiResponse> {
    try {
      const response = await fetch(`${API_URL}/candidates/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al obtener candidato con ID ${id}:`, error);
      return {
        success: false,
        message: 'Error al obtener el candidato. Por favor, inténtelo de nuevo.',
      };
    }
  },
  
  /**
   * Obtiene los candidatos recientes
   * @param limit Número de candidatos a obtener (por defecto 3)
   * @returns Respuesta de la API con la lista de candidatos recientes
   */
  async getRecentCandidates(limit: number = 3): Promise<CandidateApiResponse> {
    try {
      const response = await fetch(`${API_URL}/candidates/recent?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener candidatos recientes:', error);
      return {
        success: false,
        message: 'Error al obtener los candidatos recientes. Por favor, inténtelo de nuevo.',
        data: []
      };
    }
  },
  
  /**
   * Obtiene todos los candidatos
   * @param page Número de página (opcional, por defecto 1)
   * @param limit Número de candidatos por página (opcional, por defecto 10)
   * @returns Respuesta de la API con la lista de candidatos
   */
  async getAllCandidates(page: number = 1, limit: number = 10): Promise<CandidateApiResponse> {
    try {
      const response = await fetch(`${API_URL}/candidates?page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      return {
        success: false,
        message: 'Error al obtener los candidatos. Por favor, inténtelo de nuevo.',
        data: []
      };
    }
  },
  
  /**
   * Valida los datos del formulario de candidato
   * @param data Datos a validar
   * @returns Objeto con errores encontrados o null si no hay errores
   */
  validateCandidateData(data: Partial<CandidateFormData>): Record<string, string> | null {
    const errors: Record<string, string> = {};
    
    // Validar nombre
    if (!data.firstName?.trim()) {
      errors.firstName = 'El nombre es obligatorio';
    } else if (data.firstName.trim().length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
    } else if (data.firstName.trim().length > 50) {
      errors.firstName = 'El nombre no puede exceder los 50 caracteres';
    }
    
    // Validar apellido
    if (!data.lastName?.trim()) {
      errors.lastName = 'El apellido es obligatorio';
    } else if (data.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    } else if (data.lastName.trim().length > 50) {
      errors.lastName = 'El apellido no puede exceder los 50 caracteres';
    }
    
    // Validar email
    if (!data.email?.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'El formato del email no es válido (ejemplo: nombre@dominio.com)';
    } else if (data.email.trim().length > 100) {
      errors.email = 'El email no puede exceder los 100 caracteres';
    }
    
    // Validar teléfono
    if (!data.phone?.trim()) {
      errors.phone = 'El teléfono es obligatorio';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(data.phone)) {
      errors.phone = 'El formato del teléfono no es válido (ejemplo: +34 612345678)';
    }
    
    // Validar dirección (opcional pero con restricciones si se proporciona)
    if (data.address && data.address.trim().length > 200) {
      errors.address = 'La dirección no puede exceder los 200 caracteres';
    }
    
    // Validar educación
    if (!data.education || data.education.length === 0) {
      errors.education = 'Debe incluir al menos una entrada de educación';
    } else {
      // Validar cada entrada de educación
      data.education.forEach((edu, index) => {
        if (!edu.institution.trim()) {
          errors[`education[${index}].institution`] = 'La institución es obligatoria';
        }
        
        if (!edu.degree.trim()) {
          errors[`education[${index}].degree`] = 'El título es obligatorio';
        }
        
        if (!edu.fieldOfStudy.trim()) {
          errors[`education[${index}].fieldOfStudy`] = 'El campo de estudio es obligatorio';
        }
        
        if (!edu.startDate) {
          errors[`education[${index}].startDate`] = 'La fecha de inicio es obligatoria';
        }
      });
    }
    
    // Validar experiencia laboral (opcional pero con validaciones si se proporciona)
    if (data.workExperience && data.workExperience.length > 0) {
      data.workExperience.forEach((exp, index) => {
        if (!exp.company.trim()) {
          errors[`workExperience[${index}].company`] = 'La empresa es obligatoria';
        }
        
        if (!exp.position.trim()) {
          errors[`workExperience[${index}].position`] = 'El cargo es obligatorio';
        }
        
        if (!exp.startDate) {
          errors[`workExperience[${index}].startDate`] = 'La fecha de inicio es obligatoria';
        }
      });
    }
    
    // Validar archivo CV (opcional)
    if (data.cvFile) {
      const fileType = data.cvFile.type;
      const fileSize = data.cvFile.size;
      
      // Validar tipo de archivo
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(fileType)) {
        errors.cvFile = 'El CV debe ser un archivo PDF o DOCX';
      }
      
      // Validar tamaño de archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (fileSize > maxSize) {
        errors.cvFile = 'El tamaño del CV no puede exceder los 5MB';
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }
}; 