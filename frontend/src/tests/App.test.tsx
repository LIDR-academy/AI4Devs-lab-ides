import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { candidateService } from '../services/candidateService';

// Mock candidateService
jest.mock('../services/candidateService', () => ({
  candidateService: {
    getCandidates: jest.fn().mockResolvedValue([]),
    createCandidate: jest.fn().mockResolvedValue({}),
    updateCandidate: jest.fn().mockResolvedValue({}),
    deleteCandidate: jest.fn().mockResolvedValue(true),
    getResumeDownloadUrl: jest.fn().mockReturnValue('/api/candidates/1/resume')
  }
}));

describe('App Component', () => {
  it('renders the app header', async () => {
    render(<App />);
    
    // Check for the HR Talent Tracking System header
    const headerElement = await screen.findByText(/HR Talent Tracking System/i);
    expect(headerElement).toBeInTheDocument();
  });
  
  it('renders the candidates page as the main content', async () => {
    render(<App />);
    
    // Wait for the candidates page to render
    const pageTitle = await screen.findByText(/Candidates/i);
    expect(pageTitle).toBeInTheDocument();
    
    // Check for the Add Candidate button
    const addButton = await screen.findByRole('button', { name: /Add Candidate/i });
    expect(addButton).toBeInTheDocument();
    
    // Verify that getCandidates was called
    expect(candidateService.getCandidates).toHaveBeenCalled();
  });
});
