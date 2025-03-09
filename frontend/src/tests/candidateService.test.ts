import { candidateService } from '../services/candidateService';
import { CandidateStatus } from '../types/Candidate';

// Mock the fetch function
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe('candidateService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  
  describe('getCandidates', () => {
    it('should fetch candidates from the API', async () => {
      // Mock successful API response
      const mockCandidates = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+11234567890',
          position: 'Software Engineer',
          status: CandidateStatus.NEW,
          resumeFilename: 'resume1.pdf',
          notes: 'Note 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          education: []
        }
      ];
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockCandidates)
      });
      
      // Call the service method
      const result = await candidateService.getCandidates();
      
      // Assert fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/candidates'), {
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      });
      
      // Assert result matches mock data
      expect(result).toEqual(mockCandidates);
    });
    
    it('should handle API errors when fetching candidates', async () => {
      // Mock failed API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValueOnce('Server error')
      });
      
      // Call the service method
      const result = await candidateService.getCandidates();
      
      // Should return empty array on error
      expect(result).toEqual([]);
    });
  });
  
  describe('createCandidate', () => {
    it('should create a candidate with form data', async () => {
      // Mock successful API response
      const mockResponse = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+11234567890',
        position: 'Software Engineer',
        status: CandidateStatus.NEW,
        resumeFilename: 'resume1.pdf',
        notes: 'Test notes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        education: []
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });
      
      // Mock File object
      const mockFile = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
      
      // Create candidate data
      const candidateData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+11234567890',
        position: 'Software Engineer',
        notes: 'Test notes',
        resume: mockFile,
        education: [{
          degree: 'Bachelor',
          institution: 'University',
          fieldOfStudy: 'Computer Science',
          startYear: 2018,
          endYear: 2022,
          isCurrentlyStudying: false
        }]
      };
      
      // Call the service method
      const result = await candidateService.createCandidate(candidateData);
      
      // Assert fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/candidates'), {
        method: 'POST',
        body: expect.any(FormData)
      });
      
      // Assert result matches mock data
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle API errors when creating a candidate', async () => {
      // Mock failed API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValueOnce('Validation error')
      });
      
      // Create candidate data
      const candidateData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+11234567890',
        position: 'Software Engineer',
        notes: 'Test notes',
        education: []
      };
      
      // Call the service method
      const result = await candidateService.createCandidate(candidateData);
      
      // Result should be null
      expect(result).toBeNull();
    });
  });
  
  describe('updateCandidate', () => {
    it('should update a candidate with form data', async () => {
      // Mock successful API response
      const mockResponse = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '+11234567890',
        position: 'Senior Software Engineer',
        status: CandidateStatus.INTERVIEW,
        resumeFilename: 'resume1.pdf',
        notes: 'Updated notes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        education: []
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });
      
      // Update candidate data
      const candidateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '+11234567890',
        position: 'Senior Software Engineer',
        status: CandidateStatus.INTERVIEW,
        notes: 'Updated notes',
        education: []
      };
      
      // Call the service method
      const result = await candidateService.updateCandidate(1, candidateData);
      
      // Assert fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/candidates/1'), {
        method: 'PUT',
        body: expect.any(FormData)
      });
      
      // Assert result matches mock data
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('deleteCandidate', () => {
    it('should delete a candidate', async () => {
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ message: 'Candidate deleted successfully' })
      });
      
      // Call the service method
      const result = await candidateService.deleteCandidate(1);
      
      // Assert fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/candidates/1'), {
        method: 'DELETE'
      });
      
      // Result should be true for successful deletion
      expect(result).toBe(true);
    });
    
    it('should handle API errors when deleting a candidate', async () => {
      // Mock failed API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValueOnce('Candidate not found')
      });
      
      // Call the service method
      const result = await candidateService.deleteCandidate(999);
      
      // Result should be false for failed deletion
      expect(result).toBe(false);
    });
  });
  
  describe('getResumeDownloadUrl', () => {
    it('should return the correct download URL for a resume', () => {
      const url = candidateService.getResumeDownloadUrl(1);
      expect(url).toMatch(/\/candidates\/1\/resume/);
    });
  });
}); 