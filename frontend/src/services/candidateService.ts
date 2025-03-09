import { Candidate, CandidateFormData, CandidateStatus } from '../types/Candidate';

// API base URL - would typically come from environment variables
// Using the full URL to ensure there are no issues with relative paths
const API_BASE_URL = 'http://localhost:3010';

export const candidateService = {
  // Get all candidates
  async getCandidates(): Promise<Candidate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch (e) {
          errorDetails = await response.text();
        }
        console.error('Server error response:', errorDetails);
        throw new Error(`Failed to fetch candidates: ${response.status} ${response.statusText} - ${errorDetails}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      // Return an empty array instead of failing completely
      return [];
    }
  },

  // Get a candidate by ID
  async getCandidateById(id: number): Promise<Candidate | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching candidate ${id}:`, error);
      return null;
    }
  },

  // Create a new candidate
  async createCandidate(candidateData: CandidateFormData): Promise<Candidate | null> {
    try {
      // Create a FormData object for the file upload
      const formData = new FormData();
      
      // Add all the text fields
      formData.append('name', candidateData.name);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('position', candidateData.position);
      formData.append('status', CandidateStatus.NEW);
      
      if (candidateData.notes) {
        formData.append('notes', candidateData.notes);
      }
      
      // Add education data as JSON
      if (candidateData.education && candidateData.education.length > 0) {
        // Ensure all date fields are correctly serialized
        const safeEducation = candidateData.education.map((edu) => {
          return {
            degree: String(edu.degree || ''),
            institution: String(edu.institution || ''),
            fieldOfStudy: String(edu.fieldOfStudy || ''),
            startYear: Number(edu.startYear) || new Date().getFullYear(),
            endYear: edu.endYear ? Number(edu.endYear) : null,
            isCurrentlyStudying: Boolean(edu.isCurrentlyStudying)
          };
        });
        
        const educationJson = JSON.stringify(safeEducation);
        formData.append('education', educationJson);
      } else {
        // Send an empty array to ensure the API doesn't fail
        formData.append('education', JSON.stringify([]));
      }
      
      // Add the resume file if present
      if (candidateData.resume) {
        formData.append('resume', candidateData.resume);
      }

      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with the boundary
      });

      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch (e) {
          errorDetails = await response.text();
        }
        console.error('Server error response:', errorDetails);
        throw new Error(`Failed to create candidate: ${errorDetails}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating candidate:', error);
      return null;
    }
  },

  // Update an existing candidate
  async updateCandidate(id: number, candidateData: CandidateFormData & { status?: CandidateStatus }): Promise<Candidate | null> {
    try {
      // Create a FormData object for the file upload
      const formData = new FormData();
      
      // Add all the text fields
      formData.append('name', candidateData.name);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('position', candidateData.position);
      formData.append('status', candidateData.status || CandidateStatus.NEW);
      
      if (candidateData.notes) {
        formData.append('notes', candidateData.notes);
      }
      
      // Add education data as JSON
      if (candidateData.education && candidateData.education.length > 0) {
        // Ensure all date fields are correctly serialized
        const safeEducation = candidateData.education.map(edu => ({
          ...edu,
          startYear: Number(edu.startYear),
          endYear: edu.endYear ? Number(edu.endYear) : null,
          isCurrentlyStudying: Boolean(edu.isCurrentlyStudying)
        }));
        
        formData.append('education', JSON.stringify(safeEducation));
      } else {
        formData.append('education', JSON.stringify([]));
      }
      
      // Add the resume file if present
      if (candidateData.resume) {
        formData.append('resume', candidateData.resume);
      }

      const endpoint = `${API_BASE_URL}/candidates/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with the boundary
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to update candidate: ${errorText}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`Error updating candidate ${id}:`, error);
      return null;
    }
  },

  // Delete a candidate
  async deleteCandidate(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error(`Error deleting candidate ${id}:`, error);
      return false;
    }
  },

  // Get the URL for downloading a candidate's resume
  getResumeDownloadUrl(id: number): string {
    return `${API_BASE_URL}/candidates/${id}/resume`;
  }
}; 