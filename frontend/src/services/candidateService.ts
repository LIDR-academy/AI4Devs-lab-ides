import { Candidate, CandidateFormData, CandidateStatus } from '../types/Candidate';

// API base URL - would typically come from environment variables
// Using the full URL to ensure there are no issues with relative paths
const API_BASE_URL = 'http://localhost:3010';
console.log('API Base URL:', API_BASE_URL);

export const candidateService = {
  // Get all candidates
  async getCandidates(): Promise<Candidate[]> {
    try {
      console.log('Fetching candidates from:', `${API_BASE_URL}/candidates`);
      
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
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
      console.log('Fetched candidates:', data);
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
      // Log the original form data for debugging
      console.log('Creating candidate with data:', JSON.stringify(candidateData, (key, value) => {
        // Don't try to stringify the File object
        if (key === 'resume' && value instanceof File) return `File: ${value.name}`;
        return value;
      }, 2));
      
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
        // Check if education data is valid
        console.log(`Adding ${candidateData.education.length} education entries`);
        
        // Ensure all date fields are correctly serialized
        const safeEducation = candidateData.education.map((edu, index) => {
          console.log(`Processing education entry ${index}:`, edu);
          
          return {
            degree: String(edu.degree || ''),
            institution: String(edu.institution || ''),
            fieldOfStudy: String(edu.fieldOfStudy || ''),
            startYear: Number(edu.startYear) || new Date().getFullYear(),
            endYear: edu.endYear ? Number(edu.endYear) : null,
            isCurrentlyStudying: Boolean(edu.isCurrentlyStudying)
          };
        });
        
        // Log the education data for debugging
        console.log('Education data before serialization:', candidateData.education);
        console.log('Serialized education data:', safeEducation);
        
        const educationJson = JSON.stringify(safeEducation);
        formData.append('education', educationJson);
        console.log('Final education JSON being sent:', educationJson);
      } else {
        console.log('No education data to send');
        // Send an empty array to ensure the API doesn't fail
        formData.append('education', JSON.stringify([]));
      }
      
      // Add the resume file if present
      if (candidateData.resume) {
        formData.append('resume', candidateData.resume);
      }

      // Log all form data keys (for debugging)
      const formDataKeys: string[] = [];
      formData.forEach((value, key) => {
        formDataKeys.push(key);
      });
      console.log('Form data keys being sent:', formDataKeys);

      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with the boundary
      });

      // Log response status for debugging
      console.log('Response status:', response.status);

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
      console.log('Created candidate:', result);
      return result;
    } catch (error) {
      console.error('Error creating candidate:', error);
      return null;
    }
  },

  // Update an existing candidate
  async updateCandidate(id: number, candidateData: CandidateFormData & { status?: CandidateStatus }): Promise<Candidate | null> {
    try {
      console.log('updateCandidate called with ID:', id);
      console.log('Original candidate data:', JSON.stringify(candidateData, (key, value) => {
        // Handle the resume File object during stringify
        if (key === 'resume' && value instanceof File) {
          return `File: ${value.name} (${value.size} bytes)`;
        }
        return value;
      }));
      
      // Create a FormData object for the file upload
      const formData = new FormData();
      
      // Add all the text fields
      formData.append('name', candidateData.name);
      formData.append('email', candidateData.email);
      formData.append('phone', candidateData.phone);
      formData.append('position', candidateData.position);
      formData.append('status', candidateData.status || CandidateStatus.NEW);
      console.log('Status being sent:', candidateData.status || CandidateStatus.NEW);
      
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
        
        console.log('Education to be added:', safeEducation.length, 'entries');
        formData.append('education', JSON.stringify(safeEducation));
        console.log('Sending education data (update):', JSON.stringify(safeEducation));
      } else {
        console.log('No education data to send, adding empty array');
        formData.append('education', JSON.stringify([]));
      }
      
      // Add the resume file if present
      if (candidateData.resume) {
        console.log('Attaching resume file:', candidateData.resume.name);
        formData.append('resume', candidateData.resume);
      } else {
        console.log('No resume file to upload');
      }

      const endpoint = `${API_BASE_URL}/candidates/${id}`;
      console.log('Making PUT request to:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with the boundary
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to update candidate: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
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