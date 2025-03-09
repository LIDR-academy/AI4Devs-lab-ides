import { Candidate } from '../../../domain/entities/Candidate';

describe('Candidate', () => {
  it('should create a candidate with all properties', () => {
    const candidateData = {
      id: 1,
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      address: '123 Main St',
      education: [
        {
          institution: 'University',
          degree: 'Computer Science',
          startDate: '2018-01-01',
          endDate: '2022-01-01'
        }
      ],
      workExperience: [
        {
          company: 'Tech Corp',
          position: 'Developer',
          startDate: '2022-01-01',
          description: 'Full stack development'
        }
      ],
      cvUrl: 'http://example.com/cv.pdf'
    };

    const candidate = new Candidate(candidateData);

    expect(candidate.id).toBe(candidateData.id);
    expect(candidate.name).toBe(candidateData.name);
    expect(candidate.lastName).toBe(candidateData.lastName);
    expect(candidate.email).toBe(candidateData.email);
    expect(candidate.phone).toBe(candidateData.phone);
    expect(candidate.address).toBe(candidateData.address);
    expect(candidate.education).toEqual(candidateData.education);
    expect(candidate.workExperience).toEqual(candidateData.workExperience);
    expect(candidate.cvUrl).toBe(candidateData.cvUrl);
  });

  it('should handle optional properties', () => {
    const candidateData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    const candidate = new Candidate(candidateData);

    expect(candidate.id).toBeUndefined();
    expect(candidate.name).toBe(candidateData.name);
    expect(candidate.lastName).toBe(candidateData.lastName);
    expect(candidate.email).toBe(candidateData.email);
    expect(candidate.phone).toBeUndefined();
    expect(candidate.address).toBeUndefined();
    expect(candidate.education).toEqual([]);
    expect(candidate.workExperience).toEqual([]);
    expect(candidate.cvUrl).toBeUndefined();
  });

  it('should handle Date objects in education and work experience', () => {
    const startDate = new Date('2018-01-01');
    const endDate = new Date('2022-01-01');
    
    const candidateData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      education: [
        {
          institution: 'University',
          degree: 'Computer Science',
          startDate,
          endDate
        }
      ],
      workExperience: [
        {
          company: 'Tech Corp',
          position: 'Developer',
          startDate: new Date('2022-01-01'),
          description: 'Full stack development'
        }
      ]
    };

    const candidate = new Candidate(candidateData);

    expect(candidate.education[0].startDate).toEqual(startDate);
    expect(candidate.education[0].endDate).toEqual(endDate);
    expect(candidate.workExperience[0].startDate).toEqual(new Date('2022-01-01'));
  });

  it('should fail with invalid email', () => {
    const candidateResult = Candidate.create({
      name: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '1234567890',
      address: '123 Main St',
      education: [],
      workExperience: []
    });

    expect(candidateResult.isFail()).toBe(true);
    expect(candidateResult.getError()).toBe('Email inválido');
  });
}); 