import axios from 'axios';

const API_URL = 'http://localhost:3010/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Candidate API
export const candidateApi = {
  getAll: () => api.get('/candidates'),
  getById: (id: string) => api.get(`/candidates/${id}`),
  create: (data: any) => api.post('/candidates', data),
  update: (id: string, data: any) => api.patch(`/candidates/${id}`, data),
  delete: (id: string) => api.delete(`/candidates/${id}`),
  createWithFile: (formData: FormData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
    return axios.post(`${API_URL}/candidates`, formData, config);
  },
  updateWithFile: (id: string, formData: FormData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };
    return axios.patch(`${API_URL}/candidates/${id}`, formData, config);
  },
  downloadCV: async (id: string) => {
    try {
      // Usar axios con responseType blob para descargar el archivo
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/candidates/${id}/cv`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Obtener el nombre del archivo del header Content-Disposition si está disponible
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'cv.pdf'; // Nombre por defecto
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      
      // Crear un elemento <a> temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      throw error;
    }
  }
};

// Selection Process API
export const selectionProcessApi = {
  getAll: () => api.get('/selection-processes'),
  getById: (id: string) => api.get(`/selection-processes/${id}`),
  getByCandidate: (candidateId: string) => api.get(`/selection-processes/candidate/${candidateId}`),
  create: (data: any) => api.post('/selection-processes', data),
  update: (id: string, data: any) => api.patch(`/selection-processes/${id}`, data),
  delete: (id: string) => api.delete(`/selection-processes/${id}`),
  updateStage: (processId: string, stageId: string, data: any) => 
    api.patch(`/selection-processes/${processId}/stages/${stageId}`, data),
};

export default api; 