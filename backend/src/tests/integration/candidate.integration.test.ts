/**
 * Integration tests for the Candidate API
 * These tests require a running database and should be run in a Docker environment
 */
import request from 'supertest';
import dotenv from 'dotenv';
import { jest, describe, it, expect } from '@jest/globals';

// Load environment variables
dotenv.config();

// Define API URL from environment or use default localhost
const API_URL = process.env.API_URL || 'http://localhost:3011';
console.log(`Using API URL for candidate tests: ${API_URL}`);

// Skip tests if SKIP_INTEGRATION_TESTS is set
const skipTests = process.env.SKIP_INTEGRATION_TESTS === 'true';
const describeIntegration = skipTests ? describe.skip : describe;

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

// Test candidate data
const testCandidate = {
  firstName: 'John',
  lastName: 'Doe',
  email: `john.doe.${Date.now()}@example.com`,
  phone: '123-456-7890',
  address: '123 Main St',
  linkedinProfile: 'https://linkedin.com/in/johndoe',
  desiredSalary: '100000',
  skills: ['JavaScript', 'TypeScript', 'React']
};

describeIntegration('Candidate API Integration Tests', () => {
  let candidateId: number;

  // Test creating a candidate
  it('should create a new candidate', async () => {
    const response = await safeRequest(() =>
      request(API_URL)
        .post('/api/candidates')
        .send(testCandidate)
    );

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe(testCandidate.email);

    // Save ID for later tests
    candidateId = response.body.data.id;
  });

  // Test listing all candidates
  it('should list all candidates', async () => {
    const response = await safeRequest(() =>
      request(API_URL)
        .get('/api/candidates')
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  // Test getting a candidate by ID
  it('should get a candidate by ID', async () => {
    // Skip if previous test failed
    if (!candidateId) {
      console.warn('Skipping get candidate test because candidate creation failed');
      return;
    }

    const response = await safeRequest(() =>
      request(API_URL)
        .get(`/api/candidates/${candidateId}`)
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', candidateId);
  });

  // Test updating a candidate
  it('should update a candidate', async () => {
    // Skip if previous test failed
    if (!candidateId) {
      console.warn('Skipping update candidate test because candidate creation failed');
      return;
    }

    const updatedData = {
      firstName: 'John Updated',
      lastName: 'Doe Updated'
    };

    const response = await safeRequest(() =>
      request(API_URL)
        .put(`/api/candidates/${candidateId}`)
        .send(updatedData)
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('firstName', updatedData.firstName);
    expect(response.body.data).toHaveProperty('lastName', updatedData.lastName);
  });

  // Test deleting a candidate (soft delete)
  it('should delete a candidate', async () => {
    // Skip if previous test failed
    if (!candidateId) {
      console.warn('Skipping delete candidate test because candidate creation failed');
      return;
    }

    const response = await safeRequest(() =>
      request(API_URL)
        .delete(`/api/candidates/${candidateId}`)
    );

    expect(response.status).toBe(200);

    // Check the response format - some implementations might return different data formats
    if (response.body.data && response.body.data.deletedAt) {
      // If the API returns the deleted candidate object with deletedAt property
      expect(response.body.data).toHaveProperty('deletedAt');
      expect(response.body.data.deletedAt).not.toBeNull();
    } else {
      // The API might just return a success message or a simplified object
      expect(response.body.success).toBe(true);
    }

    // Verify the candidate is actually soft-deleted by trying to fetch it
    const getResponse = await safeRequest(() =>
      request(API_URL)
        .get(`/api/candidates/${candidateId}`)
    );

    // The API might return a 404 for deleted records, or it might return the record with deletedAt set
    if (getResponse.status === 404) {
      expect(getResponse.status).toBe(404);
    } else {
      expect(getResponse.body.data).toHaveProperty('deletedAt');
      expect(getResponse.body.data.deletedAt).not.toBeNull();
    }
  });
});