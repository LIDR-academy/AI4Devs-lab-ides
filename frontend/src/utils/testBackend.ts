import { API_CONFIG } from '../config/api.config';

export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    console.log('Backend health check status:', response.status);
    const data = await response.json();
    console.log('Health check response:', data);
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}; 