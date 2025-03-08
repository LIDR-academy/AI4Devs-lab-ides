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