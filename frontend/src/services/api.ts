import axios from 'axios';
import { Candidate } from '../types/candidate';

const API_URL = 'http://localhost:3010/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Candidate API
export const candidateApi = {
  // Get all candidates
  getAllCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await api.get('/candidates');
      return response.data as Candidate[];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Get a candidate by ID
  getCandidateById: async (id: number): Promise<Candidate> => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data as Candidate;
    } catch (error) {
      console.error(`Error fetching candidate with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new candidate
  createCandidate: async (candidate: Candidate): Promise<Candidate> => {
    try {
      const response = await api.post('/candidates', candidate);
      return response.data as Candidate;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  },

  // Update a candidate
  updateCandidate: async (id: number, candidate: Candidate): Promise<Candidate> => {
    try {
      const response = await api.put(`/candidates/${id}`, candidate);
      return response.data as Candidate;
    } catch (error) {
      console.error(`Error updating candidate with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a candidate
  deleteCandidate: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/candidates/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting candidate with ID ${id}:`, error);
      throw error;
    }
  },

  // Upload resume for a candidate
  uploadResume: async (id: number, file: File): Promise<Candidate> => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(`${API_URL}/candidates/${id}/resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data as Candidate;
    } catch (error) {
      console.error(`Error uploading resume for candidate with ID ${id}:`, error);
      throw error;
    }
  },
};

export default api; 