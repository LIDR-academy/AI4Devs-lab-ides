import axios from 'axios';
import { Candidate, CandidateFormData } from '../types/candidate';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

export const candidateService = {
  // Add a new candidate with file upload support
  async addCandidate(candidateData: CandidateFormData): Promise<Candidate> {
    try {
      // Use FormData to handle file uploads
      const formData = new FormData();
      
      // Add all string fields
      formData.append('firstName', candidateData.firstName);
      formData.append('lastName', candidateData.lastName);
      formData.append('email', candidateData.email);
      
      if (candidateData.phone) {
        formData.append('phone', candidateData.phone);
      }
      
      if (candidateData.address) {
        formData.append('address', candidateData.address);
      }
      
      if (candidateData.education) {
        formData.append('education', candidateData.education);
      }
      
      if (candidateData.workExperience) {
        formData.append('workExperience', candidateData.workExperience);
      }
      
      // Add CV file if provided
      if (candidateData.cv) {
        formData.append('cv', candidateData.cv);
      }
      
      const response = await axios.post<{message: string, data: Candidate}>(
        `${API_URL}/candidates`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  },
  
  // Get all candidates
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await axios.get<{data: Candidate[]}>(`${API_URL}/candidates`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }
}; 