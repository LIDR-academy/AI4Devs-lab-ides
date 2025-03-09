/**
 * Integration tests for the Authentication API
 * These tests require a running database and should be run in a Docker environment
 */
import request from 'supertest';
import dotenv from 'dotenv';
import { jest, describe, it, expect } from '@jest/globals';

// Load environment variables
dotenv.config();

// Define API URL from environment or use default localhost
const API_URL = process.env.API_URL || 'http://localhost:3011';
console.log(`Using API URL for auth tests: ${API_URL}`);

// Skip tests if SKIP_INTEGRATION_TESTS is set
const skipTests = process.env.SKIP_INTEGRATION_TESTS === 'true';
const describeIntegration = skipTests ? describe.skip : describe;

// Test user credentials
const testUser = {
  email: 'admin@example.com',
  password: 'password123'
};

// Helper to handle network errors gracefully
const safeRequest = async (requestFn: () => Promise<any>) => {
  try {
    return await requestFn();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Network error connecting to ${API_URL}:`, errorMessage);
    throw new Error(`Failed to connect to API at ${API_URL}: ${errorMessage}`);
  }
};

describeIntegration('Authentication API Integration Tests', () => {
  let authToken: string;

  // Test login
  it('should login with valid credentials', async () => {
    const response = await safeRequest(() =>
      request(API_URL)
        .post('/api/auth/login')
        .send(testUser)
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user).toHaveProperty('email', testUser.email);

    authToken = response.body.data.token;
  });

  // Test login with invalid credentials
  it('should reject login with invalid credentials', async () => {
    const response = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // Test accessing protected route
  it('should access protected route with valid token', async () => {
    // Skip if we don't have a token from the login test
    if (!authToken) {
      console.warn('Skipping protected route test because login test failed');
      return;
    }

    const response = await request(API_URL)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('email', testUser.email);
  });

  // Test accessing protected route without token
  it('should reject access to protected route without token', async () => {
    const response = await request(API_URL)
      .get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});