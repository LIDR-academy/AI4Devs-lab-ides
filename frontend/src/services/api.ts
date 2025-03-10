import { CandidateFormData } from '../types/candidate';
import { API_CONFIG } from '../config/api.config';

export const submitApplication = async (formData: CandidateFormData): Promise<{ success: boolean }> => {
  try {
    // Crear un FormData para enviar el archivo
    const data = new FormData();
    
    // Añadir los datos del formulario
    const { document, ...applicationData } = formData;
    data.append('data', JSON.stringify(applicationData));
    
    // Añadir el documento si existe
    if (document?.file) {
      data.append('document', document.file);
    }

    console.log('Sending request to:', `${API_CONFIG.BASE_URL}/candidates/applications`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/candidates/applications`, {
      method: 'POST',
      headers: {
        // No incluimos Content-Type porque FormData lo establece automáticamente con el boundary
        'Accept': 'application/json',
      },
      credentials: 'include', // Para enviar cookies si es necesario
      body: data,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to submit application';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  } catch (error) {
    console.error('Submit application error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Network error while submitting application');
    }
  }
}; 