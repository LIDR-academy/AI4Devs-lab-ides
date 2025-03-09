import { api } from './axios';
import { Candidate } from '../types';

export const candidateService = {
  async getAll(): Promise<Candidate[]> {
    const response = await api.get('/candidates');
    return response.data;
  },

  async getById(id: number): Promise<Candidate> {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  async create(candidateData: FormData): Promise<void> {
    try {
      // Log the FormData contents
      console.log('FormData contents:');
      Array.from(candidateData.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });

      const response = await api.post('/candidates', candidateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async update(id: number, candidateData: FormData): Promise<void> {
    try {
      const response = await api.put(`/candidates/${id}`, candidateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  }
}; 