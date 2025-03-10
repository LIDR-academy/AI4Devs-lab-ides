import {
  validatePersonalInfo,
  validateEducation,
  validateWorkExperience,
  validateDocument,
  ValidationError
} from '../validation';

describe('Form Validation Utils', () => {
  describe('validatePersonalInfo', () => {
    it('should validate complete personal info', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      };
      expect(() => validatePersonalInfo(validData)).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: '',
        phone: '1234567890'
      };
      expect(() => validatePersonalInfo(invalidData)).toThrow(ValidationError);
      expect(() => validatePersonalInfo(invalidData)).toThrow('First name is required');
    });

    it('should validate email format', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '1234567890'
      };
      expect(() => validatePersonalInfo(invalidData)).toThrow(ValidationError);
      expect(() => validatePersonalInfo(invalidData)).toThrow('Invalid email format');
    });

    it('should validate phone format', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: 'abc'
      };
      expect(() => validatePersonalInfo(invalidData)).toThrow(ValidationError);
      expect(() => validatePersonalInfo(invalidData)).toThrow('Invalid phone number format');
    });
  });

  describe('validateEducation', () => {
    it('should validate complete education entry', () => {
      const validData = [{
        title: 'Computer Science',
        institution: 'MIT',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-01')
      }];
      expect(() => validateEducation(validData)).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidData = [{
        title: '',
        institution: 'MIT',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-01')
      }];
      expect(() => validateEducation(invalidData)).toThrow(ValidationError);
      expect(() => validateEducation(invalidData)).toThrow('Degree/Title is required');
    });

    it('should validate date ranges', () => {
      const invalidData = [{
        title: 'Computer Science',
        institution: 'MIT',
        startDate: new Date('2022-09-01'),
        endDate: new Date('2020-06-01')
      }];
      expect(() => validateEducation(invalidData)).toThrow(ValidationError);
      expect(() => validateEducation(invalidData)).toThrow('End date must be after start date');
    });
  });

  describe('validateWorkExperience', () => {
    it('should validate complete work experience entry', () => {
      const validData = [{
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }];
      expect(() => validateWorkExperience(validData)).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidData = [{
        company: '',
        position: 'Software Engineer',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }];
      expect(() => validateWorkExperience(invalidData)).toThrow(ValidationError);
      expect(() => validateWorkExperience(invalidData)).toThrow('Company name is required');
    });

    it('should validate date ranges', () => {
      const invalidData = [{
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2022-12-31')
      }];
      expect(() => validateWorkExperience(invalidData)).toThrow(ValidationError);
      expect(() => validateWorkExperience(invalidData)).toThrow('End date must be after start date');
    });
  });

  describe('validateDocument', () => {
    it('should validate valid document', () => {
      const validData = {
        name: 'resume.pdf',
        file: new File([''], 'resume.pdf', { type: 'application/pdf' })
      };
      expect(() => validateDocument(validData)).not.toThrow();
    });

    it('should throw error for invalid file type', () => {
      const invalidData = {
        name: 'image.jpg',
        file: new File([''], 'image.jpg', { type: 'image/jpeg' })
      };
      expect(() => validateDocument(invalidData)).toThrow(ValidationError);
      expect(() => validateDocument(invalidData)).toThrow('Invalid file type. Only PDF, DOC, DOCX are allowed');
    });

    it('should throw error for file size exceeding limit', () => {
      // Create a 6MB file
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
      const invalidData = {
        name: 'large.pdf',
        file: largeFile
      };
      expect(() => validateDocument(invalidData)).toThrow(ValidationError);
      expect(() => validateDocument(invalidData)).toThrow('File size exceeds 5MB limit');
    });

    it('should handle missing document gracefully', () => {
      expect(() => validateDocument(null)).not.toThrow();
    });
  });
}); 