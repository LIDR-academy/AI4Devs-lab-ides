import axios from 'axios';

// Create axios instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3010/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Candidate service
export const candidateService = {
  // Get all candidates
  getAll: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Get a candidate by id
  getById: async (id: number) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Create a new candidate
  create: async (candidateData: any) => {
    // Handle file uploads
    if (candidateData.cvFile) {
      const formData = new FormData();

      // Append JSON data as a string
      const { cvFile, ...candidateDataWithoutFile } = candidateData;
      formData.append('data', JSON.stringify(candidateDataWithoutFile));

      // Append file
      formData.append('file', cvFile);

      const response = await api.post('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    // Regular JSON submission
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },

  // Update a candidate
  update: async (id: number, candidateData: any) => {
    // Handle file uploads
    if (candidateData.cvFile) {
      const formData = new FormData();

      // Append JSON data as a string
      const { cvFile, ...candidateDataWithoutFile } = candidateData;
      formData.append('data', JSON.stringify(candidateDataWithoutFile));

      // Append file
      formData.append('file', cvFile);

      const response = await api.put(`/candidates/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    // Regular JSON submission
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  // Delete a candidate
  delete: async (id: number) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};

export default api;