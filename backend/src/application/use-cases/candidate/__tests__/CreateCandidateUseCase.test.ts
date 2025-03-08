import { CreateCandidateUseCase, CreateCandidateDTO } from '../CreateCandidateUseCase';
import { Candidate } from '../../../../domain/models/Candidate';

// Mocks para los repositorios
const mockCandidateRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
  findById: jest.fn()
};

const mockSkillRepository = {
  findByName: jest.fn(),
  save: jest.fn(),
  addToCandidateSkills: jest.fn()
};

const mockEducationRepository = {
  save: jest.fn()
};

const mockWorkExperienceRepository = {
  save: jest.fn()
};

const mockDocumentRepository = {
  save: jest.fn()
};

const mockTagRepository = {
  findByName: jest.fn(),
  save: jest.fn(),
  addToCandidateTags: jest.fn()
};

describe('CreateCandidateUseCase', () => {
  let useCase: CreateCandidateUseCase;
  
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Instanciar el caso de uso con los mocks
    useCase = new CreateCandidateUseCase(
      mockCandidateRepository as any,
      mockSkillRepository as any,
      mockEducationRepository as any,
      mockWorkExperienceRepository as any,
      mockDocumentRepository as any,
      mockTagRepository as any
    );
  });
  
  it('should throw an error if a candidate with the same email already exists', async () => {
    // Preparar
    const candidateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678'
    };
    
    mockCandidateRepository.findByEmail.mockResolvedValue(Candidate.create(candidateData));
    
    // Ejecutar y verificar
    await expect(useCase.execute(candidateData)).rejects.toThrow('Ya existe un candidato con el email');
    expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(candidateData.email);
    expect(mockCandidateRepository.save).not.toHaveBeenCalled();
  });
  
  it('should create a candidate with valid data', async () => {
    // Preparar
    const candidateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678'
    };
    
    const savedCandidate = Candidate.create({
      ...candidateData,
      id: 1
    });
    
    mockCandidateRepository.findByEmail.mockResolvedValue(null);
    mockCandidateRepository.save.mockResolvedValue(savedCandidate);
    mockCandidateRepository.findById.mockResolvedValue(savedCandidate);
    
    // Ejecutar
    const result = await useCase.execute(candidateData);
    
    // Verificar
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.firstName).toBe(candidateData.firstName);
    expect(result.lastName).toBe(candidateData.lastName);
    expect(result.email).toBe(candidateData.email);
    expect(result.phone).toBe(candidateData.phone);
    
    expect(mockCandidateRepository.findByEmail).toHaveBeenCalledWith(candidateData.email);
    expect(mockCandidateRepository.save).toHaveBeenCalled();
    expect(mockCandidateRepository.findById).toHaveBeenCalledWith(1);
  });
  
  it('should create a candidate with skills', async () => {
    // Preparar
    const candidateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
      skills: [
        { name: 'JavaScript', category: 'Programming', level: 'ADVANCED' },
        { name: 'React', category: 'Frontend', level: 'INTERMEDIATE' }
      ]
    };
    
    const savedCandidate = Candidate.create({
      ...candidateData,
      id: 1
    });
    
    mockCandidateRepository.findByEmail.mockResolvedValue(null);
    mockCandidateRepository.save.mockResolvedValue(savedCandidate);
    mockCandidateRepository.findById.mockResolvedValue(savedCandidate);
    
    // Simular que la primera habilidad ya existe y la segunda no
    mockSkillRepository.findByName.mockImplementation((name: string) => {
      if (name === 'JavaScript') {
        return Promise.resolve({ id: 1, name, category: 'Programming' });
      }
      return Promise.resolve(null);
    });
    
    mockSkillRepository.save.mockImplementation((skill: any) => {
      return Promise.resolve({ ...skill, id: 2 });
    });
    
    // Ejecutar
    await useCase.execute(candidateData);
    
    // Verificar
    expect(mockSkillRepository.findByName).toHaveBeenCalledTimes(2);
    expect(mockSkillRepository.save).toHaveBeenCalledTimes(1); // Solo para la segunda habilidad
    expect(mockSkillRepository.addToCandidateSkills).toHaveBeenCalledTimes(2);
  });
  
  it('should create a candidate with educations', async () => {
    // Preparar
    const candidateData: CreateCandidateDTO = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+34612345678',
      educations: [
        {
          institution: 'University',
          degree: 'Computer Science',
          startDate: '2015-09-01',
          endDate: '2019-06-30',
          current: false,
          description: 'Bachelor degree'
        }
      ]
    };
    
    const savedCandidate = Candidate.create({
      ...candidateData,
      id: 1
    });
    
    mockCandidateRepository.findByEmail.mockResolvedValue(null);
    mockCandidateRepository.save.mockResolvedValue(savedCandidate);
    mockCandidateRepository.findById.mockResolvedValue(savedCandidate);
    
    // Ejecutar
    await useCase.execute(candidateData);
    
    // Verificar
    expect(mockEducationRepository.save).toHaveBeenCalledTimes(1);
  });
}); 