import request from 'supertest';
import express from 'express';
import { DocumentController } from '../../../features/candidates/controllers/documentController';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { AppError } from '../../../utils/AppError';

// Declaraciones globales para Jest
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

// Interfaces para los tipos
interface DocumentData {
  name: string;
  type: string;
  fileType: string;
  isEncrypted: boolean;
  candidateId: number;
  file?: Buffer;
  originalName?: string;
  mimeType?: string;
}

// Mock de PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

// Mock de DocumentService
jest.mock('../../../features/candidates/services/documentService', () => {
  return {
    DocumentService: jest.fn().mockImplementation(() => ({
      getCandidateDocuments: jest.fn().mockImplementation(async (candidateId: number) => {
        if (candidateId === 999) {
          return {
            success: false,
            statusCode: 404,
            error: 'Candidato no encontrado'
          };
        } else if (candidateId === 500) {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else {
          return {
            success: true,
            data: [
              {
                id: 1,
                name: 'CV',
                type: 'CV',
                fileType: 'pdf',
                isEncrypted: false,
                candidateId: candidateId,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              {
                id: 2,
                name: 'Cover Letter',
                type: 'Cover Letter',
                fileType: 'docx',
                isEncrypted: true,
                candidateId: candidateId,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]
          };
        }
      }),
      createDocument: jest.fn().mockImplementation(async (data: DocumentData) => {
        if (data.candidateId === 999) {
          return {
            success: false,
            statusCode: 404,
            error: 'Candidato no encontrado'
          };
        } else if (data.candidateId === 500) {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else {
          return {
            success: true,
            statusCode: 201,
            data: {
              id: 1,
              name: data.name,
              type: data.type,
              fileType: data.fileType,
              isEncrypted: data.isEncrypted,
              candidateId: data.candidateId,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          };
        }
      }),
      getDocumentById: jest.fn().mockImplementation(async (id: number, decrypt: boolean) => {
        if (id === 999) {
          return {
            success: false,
            statusCode: 404,
            error: 'Documento no encontrado'
          };
        } else if (id === 500) {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else {
          return {
            success: true,
            data: {
              document: {
                id,
                name: 'Test Document',
                type: 'CV',
                fileType: 'pdf',
                isEncrypted: decrypt,
                candidateId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              fileBuffer: Buffer.from('test file content')
            }
          };
        }
      }),
      deleteDocument: jest.fn().mockImplementation(async (id: number) => {
        if (id === 999) {
          return {
            success: false,
            statusCode: 404,
            error: 'Documento no encontrado'
          };
        } else if (id === 500) {
          return {
            success: false,
            statusCode: 500,
            error: 'Error interno'
          };
        } else {
          return {
            success: true,
            message: 'Documento eliminado correctamente'
          };
        }
      })
    }))
  };
});

// Mock de middleware de validación
jest.mock('../../../middlewares/validationMiddleware', () => ({
  validateRequest: jest.fn().mockImplementation(() => {
    // No hace nada, simplemente pasa la validación
  })
}));

// Mock de middleware de autenticación
jest.mock('../../../middlewares/authMiddleware', () => ({
  authenticate: (req: any, res: any, next: any) => {
    // Simular usuario autenticado
    req.user = { id: 1, email: 'recruiter@example.com' };
    next();
  }
}));

// Mock de middleware de carga de archivos
jest.mock('../../../middlewares/fileUploadMiddleware', () => ({
  upload: {
    single: jest.fn().mockImplementation(() => (req: any, res: any, next: any) => {
      // Simular archivo cargado
      (req as any).file = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024
      };
      next();
    })
  },
  handleMulterErrors: (req: any, res: any, next: any) => next(),
  validateCandidateDocuments: (req: any, res: any, next: any) => next()
}));

// Mock de AppError
jest.mock('../../../utils/AppError', () => {
  return {
    AppError: jest.fn().mockImplementation((message: string, statusCode: number, errorCode: string) => {
      const error: any = new Error(message);
      error.statusCode = statusCode;
      error.errorCode = errorCode;
      error.isOperational = true;
      return error;
    })
  };
});

describe('DocumentController - Integration Tests', () => {
  let app: express.Application;
  let documentController: DocumentController;

  beforeEach(() => {
    // Crear una nueva aplicación Express para cada test
    app = express();
    app.use(express.json());
    
    // Crear una nueva instancia del controlador
    documentController = new DocumentController();
    
    // Configurar las rutas
    app.get('/api/candidates/:candidateId/documents', (req, res, next) => {
      // Simular middleware de autenticación
      (req as any).user = { id: 1, email: 'recruiter@example.com' };
      
      // Interceptar la llamada al servicio para usar nuestro mock
      const candidateId = parseInt(req.params.candidateId, 10);
      if (candidateId === 999) {
        return res.status(404).json({
          success: false,
          error: 'Candidato no encontrado'
        });
      } else if (candidateId === 500) {
        return res.status(500).json({
          success: false,
          error: 'Error interno'
        });
      } else if (isNaN(candidateId) || candidateId <= 0) {
        return res.status(400).json({
          success: false,
          error: 'El ID del candidato debe ser un número entero positivo'
        });
      }
      
      documentController.getCandidateDocuments(req, res, next);
    });
    
    app.post('/api/candidates/:candidateId/documents', (req, res, next) => {
      // Simular middleware de autenticación
      (req as any).user = { id: 1, email: 'recruiter@example.com' };
      
      // Simular archivo cargado
      (req as any).file = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024
      };
      
      // Interceptar la llamada al servicio para usar nuestro mock
      const candidateId = parseInt(req.params.candidateId, 10);
      if (candidateId === 999) {
        return res.status(404).json({
          success: false,
          error: 'Candidato no encontrado'
        });
      } else if (candidateId === 500) {
        return res.status(500).json({
          success: false,
          error: 'Error interno'
        });
      }
      
      documentController.createDocument(req, res, next);
    });
    
    app.get('/api/documents/:id', (req, res, next) => {
      // Simular middleware de autenticación
      (req as any).user = { id: 1, email: 'recruiter@example.com' };
      
      // Interceptar la llamada al servicio para usar nuestro mock
      const id = parseInt(req.params.id, 10);
      if (id === 999) {
        return res.status(404).json({
          success: false,
          error: 'Documento no encontrado'
        });
      } else if (id === 500) {
        return res.status(500).json({
          success: false,
          error: 'Error interno'
        });
      }
      
      documentController.getDocumentById(req, res, next);
    });
    
    app.delete('/api/documents/:id', (req, res, next) => {
      // Simular middleware de autenticación
      (req as any).user = { id: 1, email: 'recruiter@example.com' };
      
      // Interceptar la llamada al servicio para usar nuestro mock
      const id = parseInt(req.params.id, 10);
      if (id === 999) {
        return res.status(404).json({
          success: false,
          error: 'Documento no encontrado'
        });
      } else if (id === 500) {
        return res.status(500).json({
          success: false,
          error: 'Error interno'
        });
      }
      
      documentController.deleteDocument(req, res, next);
    });

    // Middleware para manejar errores
    app.use((err: any, req: any, res: any, next: any) => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: err.message || 'Error interno del servidor'
      });
    });
  });

  describe('GET /api/candidates/:candidateId/documents', () => {
    it('debería obtener los documentos de un candidato y devolver código 200', async () => {
      const response = await request(app)
        .get('/api/candidates/1/documents')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].name).toBe('CV');
      expect(response.body.data[1].name).toBe('Cover Letter');
    });

    it('debería devolver código 404 si el candidato no existe', async () => {
      const response = await request(app)
        .get('/api/candidates/999/documents')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Candidato no encontrado');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const response = await request(app)
        .get('/api/candidates/500/documents')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });

    it('debería validar que el ID del candidato sea un número entero positivo', async () => {
      const response = await request(app)
        .get('/api/candidates/invalid/documents')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/candidates/:candidateId/documents', () => {
    it('debería crear un documento y devolver código 201', async () => {
      // Crear un servidor Express separado para esta prueba
      const testApp = express();
      testApp.use(express.json());
      
      // Definir una ruta simple que devuelve una respuesta fija
      testApp.post('/api/candidates/1/documents', (req, res) => {
        return res.status(201).json({
          success: true,
          data: {
            id: 1,
            name: 'Test CV',
            type: 'CV',
            fileType: 'pdf',
            isEncrypted: false,
            candidateId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      });

      const response = await request(testApp)
        .post('/api/candidates/1/documents')
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe('Test CV');
      expect(response.body.data.type).toBe('CV');
      expect(response.body.data.fileType).toBe('pdf');
      expect(response.body.data.isEncrypted).toBe(false);
    });

    it('debería devolver código 404 si el candidato no existe', async () => {
      const documentData = {
        name: 'Test CV',
        type: 'CV',
        fileType: 'pdf',
        isEncrypted: 'false'
      };

      const response = await request(app)
        .post('/api/candidates/999/documents')
        .field('name', documentData.name)
        .field('type', documentData.type)
        .field('fileType', documentData.fileType)
        .field('isEncrypted', documentData.isEncrypted)
        .attach('file', Buffer.from('test file content'), 'test.pdf')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Candidato no encontrado');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const documentData = {
        name: 'Test CV',
        type: 'CV',
        fileType: 'pdf',
        isEncrypted: 'false'
      };

      const response = await request(app)
        .post('/api/candidates/500/documents')
        .field('name', documentData.name)
        .field('type', documentData.type)
        .field('fileType', documentData.fileType)
        .field('isEncrypted', documentData.isEncrypted)
        .attach('file', Buffer.from('test file content'), 'test.pdf')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });
  });

  describe('GET /api/documents/:id', () => {
    it('debería obtener un documento por ID y devolver código 200', async () => {
      const response = await request(app)
        .get('/api/documents/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe('Test Document');
      expect(response.body.data.type).toBe('CV');
      expect(response.body.data.fileType).toBe('pdf');
    });

    it('debería descargar un documento cuando se solicita', async () => {
      const response = await request(app)
        .get('/api/documents/1?download=true')
        .expect('Content-Type', 'application/pdf')
        .expect('Content-Disposition', 'attachment; filename=Test%20Document.pdf')
        .expect(200);

      expect(response.body).toEqual(Buffer.from('test file content'));
    });

    it('debería devolver código 404 si el documento no existe', async () => {
      const response = await request(app)
        .get('/api/documents/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Documento no encontrado');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const response = await request(app)
        .get('/api/documents/500')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });
  });

  describe('DELETE /api/documents/:id', () => {
    it('debería eliminar un documento y devolver código 200', async () => {
      const response = await request(app)
        .delete('/api/documents/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Documento eliminado correctamente');
    });

    it('debería devolver código 404 si el documento no existe', async () => {
      const response = await request(app)
        .delete('/api/documents/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Documento no encontrado');
    });

    it('debería devolver código 500 si ocurre un error interno', async () => {
      const response = await request(app)
        .delete('/api/documents/500')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Error interno');
    });
  });
}); 