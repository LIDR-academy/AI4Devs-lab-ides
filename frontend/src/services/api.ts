import axios from 'axios';
import { Candidate, CandidateFormData } from '../types/candidate';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const candidateService = {
  async createCandidate(candidateData: CandidateFormData): Promise<Candidate> {
    const formData = new FormData();
    
    // Añadir los datos del candidato
    formData.append('firstName', candidateData.firstName);
    formData.append('lastName', candidateData.lastName);
    formData.append('email', candidateData.email);
    formData.append('phone', candidateData.phone);
    formData.append('address', candidateData.address);
    
    // Añadir educación y experiencia como JSON
    formData.append('education', JSON.stringify(candidateData.education));
    formData.append('experience', JSON.stringify(candidateData.experience));
    
    // Añadir el CV si existe
    if (candidateData.cv) {
      formData.append('cv', candidateData.cv);
    }
    
    const response = await api.post<Candidate>('/candidates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  async getCandidates(): Promise<Candidate[]> {
    const response = await api.get<Candidate[]>('/candidates');
    return response.data;
  },
  
  async getCandidate(id: number): Promise<Candidate> {
    const response = await api.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },
};

export default api; 