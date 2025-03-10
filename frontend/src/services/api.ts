import axios from 'axios';
import { Candidate, CandidateFormData } from '../types/candidate';

// Configuración base de axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para candidatos
export const candidateService = {
  /**
   * Crea un nuevo candidato
   * @param candidateData Datos del candidato
   * @returns Respuesta de la API
   */
  async createCandidate(candidateData: CandidateFormData): Promise<{ message: string; candidate: Candidate }> {
    const formData = new FormData();
    
    // Agregar el archivo CV si existe
    if (candidateData.cv) {
      formData.append('cv', candidateData.cv);
    }
    
    // Eliminar el archivo CV del objeto de datos
    const { cv, ...candidateDataWithoutCv } = candidateData;
    
    // Agregar los datos del candidato como JSON
    formData.append('firstName', candidateDataWithoutCv.firstName);
    formData.append('lastName', candidateDataWithoutCv.lastName);
    formData.append('email', candidateDataWithoutCv.email);
    
    if (candidateDataWithoutCv.phone) {
      formData.append('phone', candidateDataWithoutCv.phone);
    }
    
    if (candidateDataWithoutCv.address) {
      formData.append('address', candidateDataWithoutCv.address);
    }
    
    if (candidateDataWithoutCv.city) {
      formData.append('city', candidateDataWithoutCv.city);
    }
    
    if (candidateDataWithoutCv.state) {
      formData.append('state', candidateDataWithoutCv.state);
    }
    
    if (candidateDataWithoutCv.country) {
      formData.append('country', candidateDataWithoutCv.country);
    }
    
    if (candidateDataWithoutCv.postalCode) {
      formData.append('postalCode', candidateDataWithoutCv.postalCode);
    }
    
    if (candidateDataWithoutCv.summary) {
      formData.append('summary', candidateDataWithoutCv.summary);
    }
    
    // Agregar educación, experiencia laboral y habilidades como JSON
    if (candidateDataWithoutCv.education && candidateDataWithoutCv.education.length > 0) {
      formData.append('education', JSON.stringify(candidateDataWithoutCv.education));
    }
    
    if (candidateDataWithoutCv.workExperience && candidateDataWithoutCv.workExperience.length > 0) {
      formData.append('workExperience', JSON.stringify(candidateDataWithoutCv.workExperience));
    }
    
    if (candidateDataWithoutCv.skills && candidateDataWithoutCv.skills.length > 0) {
      formData.append('skills', JSON.stringify(candidateDataWithoutCv.skills));
    }
    
    const response = await api.post('/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export default api; 