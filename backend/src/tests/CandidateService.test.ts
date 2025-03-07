import { CandidateService } from '../services/CandidateService';

describe('CandidateService', () => {
  const candidateService = new CandidateService();

  it('should add a candidate successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const candidate = await candidateService.addCandidate(candidateData);
    expect(candidate).toHaveProperty('id');
    expect(candidate.email).toBe(candidateData.email);
  });

  it('should throw an error if email is not unique', async () => {
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john.doe@example.com', // Duplicate email
    };

    await expect(candidateService.addCandidate(candidateData)).rejects.toThrow(
      'Error al añadir el candidato'
    );
  });
});