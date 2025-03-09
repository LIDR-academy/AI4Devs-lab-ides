// This is a utility for development purposes only
// In a real application, this would be handled by a proper authentication system

/**
 * Generates a test token and stores it in localStorage
 * This is for development purposes only
 */
export const generateTestToken = (): string => {
  // In a real app, this would be obtained from a login API
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTYxNjI4MDAsImV4cCI6MTYxNjI0OTIwMH0.8Vx2Qx7zLdaHH5X9tLzQ4XzgwSQvl4TH5lBLcLM3XYY';
  
  // Store token in localStorage
  localStorage.setItem('token', token);
  
  return token;
};

/**
 * Checks if a user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Logs out the user by removing the token
 */
export const logout = (): void => {
  localStorage.removeItem('token');
};

// Generate a test token on import (for development)
if (process.env.NODE_ENV === 'development' && !isAuthenticated()) {
  generateTestToken();
} 