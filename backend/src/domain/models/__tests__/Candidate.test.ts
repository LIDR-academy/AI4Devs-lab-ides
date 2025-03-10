import { Candidate } from '../Candidate';

describe('Candidate', () => {
  it('should create a candidate with valid data', () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    };

    const candidate = Candidate.create(candidateData);

    expect(candidate).toBeDefined();
    expect(candidate.firstName).toBe(candidateData.firstName);
    expect(candidate.lastName).toBe(candidateData.lastName);
    expect(candidate.email).toBe(candidateData.email);
    expect(candidate.phone).toBe(candidateData.phone);
    expect(candidate.fullName).toBe(`${candidateData.firstName} ${candidateData.lastName}`);
  });

  it('should validate if the email is valid', () => {
    const validCandidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    });

    const invalidCandidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '+34612345678',
    });

    expect(validCandidate.isValidEmail()).toBe(true);
    expect(invalidCandidate.isValidEmail()).toBe(false);
  });

  it('should validate if the phone is valid', () => {
    const validCandidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    });

    const invalidCandidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: 'not-a-phone',
    });

    expect(validCandidate.isValidPhone()).toBe(true);
    expect(invalidCandidate.isValidPhone()).toBe(false);
  });

  it('should validate if the candidate data is valid', () => {
    const validCandidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    });

    const emptyFirstNameCandidate = Candidate.create({
      firstName: '',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    });

    const invalidEmailCandidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '+34612345678',
    });

    expect(validCandidate.isValid()).toBe(true);
    expect(emptyFirstNameCandidate.isValid()).toBe(false);
    expect(invalidEmailCandidate.isValid()).toBe(false);
  });

  it('should update personal information', () => {
    const candidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    });

    candidate.updatePersonalInfo({
      firstName: 'Jane',
      address: '123 Main St',
      city: 'New York',
    });

    expect(candidate.firstName).toBe('Jane');
    expect(candidate.lastName).toBe('Doe'); // Unchanged
    expect(candidate.address).toBe('123 Main St');
    expect(candidate.city).toBe('New York');
  });

  it('should update professional information', () => {
    const candidate = Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
    });

    candidate.updateProfessionalInfo({
      currentPosition: 'Software Engineer',
      currentCompany: 'Tech Co',
      yearsOfExperience: 5,
    });

    expect(candidate.currentPosition).toBe('Software Engineer');
    expect(candidate.currentCompany).toBe('Tech Co');
    expect(candidate.yearsOfExperience).toBe(5);
  });

  it('should serialize to JSON', () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
      address: '123 Main St',
    };

    const candidate = Candidate.create(candidateData);
    const json = candidate.toJSON();

    expect(json).toEqual(expect.objectContaining({
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      address: candidateData.address,
      skills: [],
      educations: [],
      experiences: [],
      tags: [],
      documents: [],
    }));
    expect(json.createdAt).toBeInstanceOf(Date);
    expect(json.updatedAt).toBeInstanceOf(Date);
  });
}); 