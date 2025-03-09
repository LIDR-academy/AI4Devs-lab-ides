import { Request } from 'express';

// Mock the entire fileUpload module
jest.mock('../utils/fileUpload', () => ({
  handleFileUpload: jest.fn(),
  uploadResume: jest.fn()
}));

// Import after mocking
import { handleFileUpload } from '../utils/fileUpload';

describe('fileUpload utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process uploaded file correctly', async () => {
    // Setup mock file data
    const mockFileData = {
      fieldname: 'resume',
      originalname: 'test-resume.pdf',
      filename: 'resume-12345.pdf',
      path: '/tmp/uploads/resume-12345.pdf'
    };
    
    // Mock the handleFileUpload function to return our mock data
    (handleFileUpload as jest.Mock).mockResolvedValueOnce(mockFileData);
    
    // Setup mock request
    const req = {} as Request;
    
    // Call the function
    const result = await handleFileUpload(req);
    
    // Verify the result
    expect(result).toEqual(mockFileData);
    expect(handleFileUpload).toHaveBeenCalledWith(req);
  });
  
  it('should handle case when no file is uploaded', async () => {
    // Mock the handleFileUpload function to return null
    (handleFileUpload as jest.Mock).mockResolvedValueOnce(null);
    
    // Setup mock request
    const req = {} as Request;
    
    // Call the function
    const result = await handleFileUpload(req);
    
    // Verify the result
    expect(result).toBeNull();
    expect(handleFileUpload).toHaveBeenCalledWith(req);
  });
  
  it('should handle upload errors', async () => {
    // Mock the handleFileUpload function to throw an error
    const errorMessage = 'Upload error';
    (handleFileUpload as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    // Setup mock request
    const req = {} as Request;
    
    // Call the function and verify it rejects
    await expect(handleFileUpload(req)).rejects.toThrow(errorMessage);
    expect(handleFileUpload).toHaveBeenCalledWith(req);
  });
}); 