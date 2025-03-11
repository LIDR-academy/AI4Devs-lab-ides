import axios from 'axios';
import { candidateService } from '../../../features/candidates/services/candidateService';
import { Candidate } from '../../../features/candidates/types';

// Mock de axios
jest.mock('axios');

// Mock del servicio de autenticación
jest.mock('../../../features/auth/services/authService', () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  return {
    __esModule: true,
    default: mockAxios,
    setAuthToken: jest.fn()
  };
});

// Importar el mock después de definirlo
import api from '../../../features/auth/services/authService';

describe('candidateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCandidates', () => {
    it('debe devolver una lista de candidatos cuando la solicitud es exitosa', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              status: 'active' as const,
              skills: ['JavaScript', 'React'],
              education: [{ institution: 'Universidad', degree: 'Ingeniería', startDate: '2015-01-01' }],
              workExperience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01' }],
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
            },
          ],
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.getCandidates();

      expect(api.get).toHaveBeenCalledWith('/api/candidates');
      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].firstName).toBe('John');
      }
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de error
      const error = new Error('Error de red');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.getCandidates();

      expect(api.get).toHaveBeenCalledWith('/api/candidates');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al obtener candidatos');
    });

    it('debe manejar errores de respuesta del servidor', async () => {
      // Mock de error de respuesta
      const errorResponse = {
        response: {
          data: {
            error: 'Error del servidor',
          },
        },
      };
      (api.get as jest.Mock).mockRejectedValue(errorResponse);

      const result = await candidateService.getCandidates();

      expect(api.get).toHaveBeenCalledWith('/api/candidates');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error del servidor');
    });
  });

  describe('getCandidateById', () => {
    it('debe devolver un candidato cuando la solicitud es exitosa', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            status: 'active' as const,
            skills: ['JavaScript', 'React'],
            education: [{ institution: 'Universidad', degree: 'Ingeniería', startDate: '2015-01-01' }],
            workExperience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01' }],
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.getCandidateById(1);

      expect(api.get).toHaveBeenCalledWith('/api/candidates/1');
      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.firstName).toBe('John');
      }
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de error
      const error = new Error('Error de red');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.getCandidateById(1);

      expect(api.get).toHaveBeenCalledWith('/api/candidates/1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al obtener el candidato');
    });
  });

  describe('createCandidate', () => {
    it('debe crear un candidato cuando la solicitud es exitosa', async () => {
      // Mock de datos del candidato
      const candidateData: Partial<Candidate> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123456789',
        position: 'Desarrollador',
        status: 'active',
        skills: ['JavaScript', 'React'],
        education: [{ institution: 'Universidad', degree: 'Ingeniería', startDate: '2015-01-01' }],
        workExperience: [{ company: 'Empresa', position: 'Desarrollador', startDate: '2020-01-01' }],
        summary: 'Resumen profesional',
      };

      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            ...candidateData,
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        },
      };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.createCandidate(candidateData);

      expect(api.post).toHaveBeenCalledWith('/api/candidates', expect.any(Object));
      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de datos del candidato
      const candidateData: Partial<Candidate> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      // Mock de error
      const error = new Error('Error de red');
      (api.post as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.createCandidate(candidateData);

      expect(api.post).toHaveBeenCalledWith('/api/candidates', expect.any(Object));
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al crear el candidato');
    });

    it('debe manejar errores de respuesta del servidor', async () => {
      // Mock de datos del candidato
      const candidateData: Partial<Candidate> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      // Mock de error de respuesta
      const errorResponse = {
        response: {
          data: {
            error: 'Ya existe un candidato con ese email',
          },
        },
      };
      (api.post as jest.Mock).mockRejectedValue(errorResponse);

      const result = await candidateService.createCandidate(candidateData);

      expect(api.post).toHaveBeenCalledWith('/api/candidates', expect.any(Object));
      expect(result.success).toBe(false);
      expect(result.error).toBe('Ya existe un candidato con ese email');
    });
  });

  describe('updateCandidate', () => {
    it('debe actualizar un candidato cuando la solicitud es exitosa', async () => {
      // Mock de datos de actualización
      const updateData: Partial<Candidate> = {
        firstName: 'John Updated',
        status: 'interview',
      };

      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            firstName: 'John Updated',
            lastName: 'Doe',
            email: 'john@example.com',
            status: 'interview',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
          },
        },
      };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.updateCandidate(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/api/candidates/1', updateData);
      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de datos de actualización
      const updateData: Partial<Candidate> = {
        firstName: 'John Updated',
      };

      // Mock de error
      const error = new Error('Error de red');
      (api.put as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.updateCandidate(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/api/candidates/1', updateData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al actualizar el candidato');
    });
  });

  describe('deleteCandidate', () => {
    it('debe eliminar un candidato cuando la solicitud es exitosa', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          message: 'Candidato eliminado correctamente',
        },
      };

      (api.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.deleteCandidate(1);

      expect(api.delete).toHaveBeenCalledWith('/api/candidates/1');
      expect(result).toEqual(mockResponse.data);
      expect(result.success).toBe(true);
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de error
      const error = new Error('Error de red');
      (api.delete as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.deleteCandidate(1);

      expect(api.delete).toHaveBeenCalledWith('/api/candidates/1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al eliminar el candidato');
    });
  });

  describe('uploadDocument', () => {
    it('debe subir un documento cuando la solicitud es exitosa', async () => {
      // Mock de FormData
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.pdf');
      formData.append('type', 'CV');

      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'test.pdf',
            type: 'CV',
          },
        },
      };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.uploadDocument(1, formData);

      expect(api.post).toHaveBeenCalledWith('/api/candidates/1/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual({
        success: true,
        data: mockResponse.data,
      });
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de FormData
      const formData = new FormData();

      // Mock de error
      const error = new Error('Error de red');
      (api.post as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.uploadDocument(1, formData);

      expect(api.post).toHaveBeenCalledWith('/api/candidates/1/documents', formData, expect.any(Object));
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión. Por favor, inténtelo de nuevo más tarde.');
    });
  });

  describe('getCandidateDocuments', () => {
    it('debe obtener documentos de un candidato cuando la solicitud es exitosa', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          data: [
            {
              id: 1,
              name: 'CV.pdf',
              type: 'CV',
            },
            {
              id: 2,
              name: 'Carta.docx',
              type: 'Cover Letter',
            },
          ],
        },
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.getCandidateDocuments(1);

      expect(api.get).toHaveBeenCalledWith('/api/candidates/1/documents');
      expect(result).toEqual({
        success: true,
        data: mockResponse.data.data,
      });
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de error
      const error = new Error('Error de red');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.getCandidateDocuments(1);

      expect(api.get).toHaveBeenCalledWith('/api/candidates/1/documents');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión. Por favor, inténtelo de nuevo más tarde.');
    });
  });

  describe('deleteDocument', () => {
    it('debe eliminar un documento cuando la solicitud es exitosa', async () => {
      // Mock de respuesta exitosa
      const mockResponse = {
        data: {
          success: true,
          message: 'Documento eliminado correctamente',
        },
      };

      (api.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await candidateService.deleteDocument(1);

      expect(api.delete).toHaveBeenCalledWith('/api/documents/1');
      expect(result).toEqual({
        success: true,
        data: mockResponse.data,
      });
    });

    it('debe manejar errores en la solicitud', async () => {
      // Mock de error
      const error = new Error('Error de red');
      (api.delete as jest.Mock).mockRejectedValue(error);

      const result = await candidateService.deleteDocument(1);

      expect(api.delete).toHaveBeenCalledWith('/api/documents/1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión. Por favor, inténtelo de nuevo más tarde.');
    });
  });

  describe('searchSkills', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return empty array for empty query', async () => {
      // Act
      const result = await candidateService.searchSkills('');

      // Assert
      expect(result).toEqual({ success: true, data: [] });
      expect(api.get).not.toHaveBeenCalled();
    });

    it('should return skills matching the query', async () => {
      // Arrange
      const mockSkills = ['JavaScript', 'Java', 'Java Spring'];
      const mockResponse = {
        data: {
          success: true,
          data: mockSkills
        }
      };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await candidateService.searchSkills('jav');

      // Assert
      expect(api.get).toHaveBeenCalledWith('/api/candidates/skills/search?query=jav');
      expect(result).toEqual({
        success: true,
        data: mockSkills
      });
    });

    it('should handle API errors', async () => {
      // Arrange
      const mockError = {
        response: {
          data: {
            error: 'Error al buscar habilidades'
          }
        }
      };
      (api.get as jest.Mock).mockRejectedValue(mockError);

      // Act
      const result = await candidateService.searchSkills('jav');

      // Assert
      expect(api.get).toHaveBeenCalledWith('/api/candidates/skills/search?query=jav');
      expect(result).toEqual({
        success: false,
        error: 'Error al buscar habilidades'
      });
    });

    it('should handle network errors', async () => {
      // Arrange
      const mockError = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(mockError);

      // Act
      const result = await candidateService.searchSkills('jav');

      // Assert
      expect(api.get).toHaveBeenCalledWith('/api/candidates/skills/search?query=jav');
      expect(result).toEqual({
        success: false,
        error: 'Error al buscar habilidades'
      });
    });
  });
}); 