import { DocumentService } from '../../../features/candidates/services/documentService';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../../../utils/AppError';

// Mock de fs/promises
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn()
}));

// Mock de fileUploadUtils
jest.mock('../../../utils/fileUploadUtils', () => ({
  saveFile: jest.fn(),
  generateUniqueFileName: jest.fn(),
  getFileExtension: jest.fn(),
  encryptFile: jest.fn(),
  generateEncryptionKey: jest.fn(),
  decryptFile: jest.fn(),
  deleteFile: jest.fn()
}));

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    document: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn()
    },
    candidate: {
      findUnique: jest.fn()
    }
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

// Importar los mocks
import fs from 'fs/promises';
import * as fileUploadUtils from '../../../utils/fileUploadUtils';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockPrisma: any;

  beforeEach(() => {
    // Resetear todos los mocks antes de cada test
    jest.clearAllMocks();
    
    // Obtener la instancia mockeada de PrismaClient
    mockPrisma = new PrismaClient();
    
    // Crear una nueva instancia del servicio para cada test
    documentService = new DocumentService();
  });

  describe('createDocument', () => {
    const mockDocumentData = {
      name: 'Test Document',
      type: 'CV' as const,
      fileType: 'pdf' as const,
      isEncrypted: false,
      candidateId: 1,
      file: Buffer.from('test file content'),
      originalName: 'test.pdf',
      mimeType: 'application/pdf'
    };

    const mockCandidate = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    const mockCreatedDocument = {
      id: 1,
      name: 'Test Document',
      type: 'CV',
      fileType: 'pdf',
      fileUrl: '/uploads/test-file.pdf',
      isEncrypted: false,
      candidateId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('debería crear un documento correctamente', async () => {
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      mockPrisma.document.create.mockResolvedValue(mockCreatedDocument);
      (fileUploadUtils.generateUniqueFileName as jest.Mock).mockReturnValue('test-file.pdf');
      (fileUploadUtils.saveFile as jest.Mock).mockResolvedValue('/uploads/test-file.pdf');

      // Ejecutar el método
      const result = await documentService.createDocument(mockDocumentData);

      // Verificar resultado
      expect(result.success).toBe(true);
      // Verificar solo las propiedades que nos interesan en lugar de todo el objeto
      expect(result.data.id).toEqual(mockCreatedDocument.id);
      expect(result.data.name).toEqual(mockCreatedDocument.name);
      expect(result.data.type).toEqual(mockCreatedDocument.type);
      expect(result.data.fileType).toEqual(mockCreatedDocument.fileType);
      expect(result.data.isEncrypted).toEqual(mockCreatedDocument.isEncrypted);
      expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: mockDocumentData.candidateId }
      });
      expect(fileUploadUtils.saveFile).toHaveBeenCalled();
      expect(mockPrisma.document.create).toHaveBeenCalled();
    });

    it('debería crear un documento encriptado correctamente', async () => {
      const encryptedDocumentData = {
        ...mockDocumentData,
        isEncrypted: true
      };
      
      const encryptionKey = Buffer.from('test-encryption-key');
      const encryptedBuffer = Buffer.from('encrypted-content');
      
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      mockPrisma.document.create.mockResolvedValue({
        ...mockCreatedDocument,
        isEncrypted: true,
        encryptionKey: encryptionKey.toString('hex')
      });
      (fileUploadUtils.generateUniqueFileName as jest.Mock).mockReturnValue('test-file.pdf');
      (fileUploadUtils.generateEncryptionKey as jest.Mock).mockReturnValue(encryptionKey);
      (fileUploadUtils.encryptFile as jest.Mock).mockReturnValue(encryptedBuffer);
      (fileUploadUtils.saveFile as jest.Mock).mockResolvedValue('/uploads/test-file.pdf');

      // Ejecutar el método
      const result = await documentService.createDocument(encryptedDocumentData);

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.data.isEncrypted).toBe(true);
      expect(fileUploadUtils.generateEncryptionKey).toHaveBeenCalled();
      expect(fileUploadUtils.encryptFile).toHaveBeenCalledWith(encryptedDocumentData.file, encryptionKey);
    });

    it('debería devolver error si el candidato no existe', async () => {
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(null);

      // Ejecutar y verificar que lanza error
      await expect(documentService.createDocument(mockDocumentData))
        .rejects
        .toThrow(AppError);
      
      // Verificar que no se llamó a crear documento
      expect(mockPrisma.document.create).not.toHaveBeenCalled();
    });

    it('debería manejar errores al guardar el archivo', async () => {
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      (fileUploadUtils.saveFile as jest.Mock).mockRejectedValue(new Error('Error al guardar archivo'));

      // Ejecutar y verificar que lanza error
      await expect(documentService.createDocument(mockDocumentData))
        .rejects
        .toThrow(AppError);
      
      // Verificar que no se llamó a crear documento
      expect(mockPrisma.document.create).not.toHaveBeenCalled();
    });
  });

  describe('getCandidateDocuments', () => {
    const candidateId = 1;
    const mockCandidate = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    const mockDocuments = [
      {
        id: 1,
        name: 'CV',
        type: 'CV',
        fileType: 'pdf',
        fileUrl: '/uploads/cv.pdf',
        isEncrypted: false,
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Cover Letter',
        type: 'Cover Letter',
        fileType: 'docx',
        fileUrl: '/uploads/cover.docx',
        isEncrypted: true,
        createdAt: new Date()
      }
    ];

    it('debería obtener los documentos de un candidato correctamente', async () => {
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      mockPrisma.document.findMany.mockResolvedValue(mockDocuments);

      // Ejecutar el método
      const result = await documentService.getCandidateDocuments(candidateId);

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDocuments);
      expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
        where: { id: candidateId }
      });
      expect(mockPrisma.document.findMany).toHaveBeenCalledWith({
        where: { candidateId },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object)
      });
    });

    it('debería devolver error si el candidato no existe', async () => {
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(null);

      // Ejecutar y verificar que lanza error
      await expect(documentService.getCandidateDocuments(candidateId))
        .rejects
        .toThrow(AppError);
      
      // Verificar que no se llamó a buscar documentos
      expect(mockPrisma.document.findMany).not.toHaveBeenCalled();
    });

    it('debería manejar errores de base de datos', async () => {
      // Configurar mocks
      mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);
      mockPrisma.document.findMany.mockRejectedValue(new Error('Database error'));

      // Ejecutar y verificar que lanza error
      await expect(documentService.getCandidateDocuments(candidateId))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('getDocumentById', () => {
    const documentId = 1;
    const mockDocument = {
      id: 1,
      name: 'Test Document',
      type: 'CV',
      fileType: 'pdf',
      fileUrl: '/uploads/test-file.pdf',
      isEncrypted: false,
      encryptionKey: null,
      candidateId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const fileContent = Buffer.from('test file content');

    it('debería obtener un documento correctamente', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(fileContent);

      // Ejecutar el método
      const result = await documentService.getDocumentById(documentId);

      // Verificar resultado
      expect(result.success).toBe(true);
      // Verificar solo las propiedades que nos interesan en lugar de todo el objeto
      expect(result.data.document.id).toEqual(mockDocument.id);
      expect(result.data.document.name).toEqual(mockDocument.name);
      expect(result.data.document.type).toEqual(mockDocument.type);
      expect(result.data.document.fileType).toEqual(mockDocument.fileType);
      expect(result.data.document.isEncrypted).toEqual(mockDocument.isEncrypted);
      expect(result.data.fileBuffer).toEqual(fileContent);
      expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({
        where: { id: documentId }
      });
      expect(fs.access).toHaveBeenCalledWith(mockDocument.fileUrl);
      expect(fs.readFile).toHaveBeenCalledWith(mockDocument.fileUrl);
    });

    it('debería desencriptar un documento encriptado', async () => {
      const encryptedDocument = {
        ...mockDocument,
        isEncrypted: true,
        encryptionKey: Buffer.from('test-key').toString('hex')
      };
      const encryptedContent = Buffer.from('encrypted content');
      const decryptedContent = Buffer.from('decrypted content');

      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(encryptedDocument);
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(encryptedContent);
      (fileUploadUtils.decryptFile as jest.Mock).mockReturnValue(decryptedContent);

      // Ejecutar el método
      const result = await documentService.getDocumentById(documentId, true);

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.data.fileBuffer).toEqual(decryptedContent);
      expect(fileUploadUtils.decryptFile).toHaveBeenCalled();
    });

    it('debería devolver error si el documento no existe', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(null);

      // Ejecutar y verificar que lanza error
      await expect(documentService.getDocumentById(documentId))
        .rejects
        .toThrow(AppError);
    });

    it('debería devolver error si el archivo no existe', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      (fs.access as jest.Mock).mockRejectedValue(new Error('File not found'));

      // Ejecutar y verificar que lanza error
      await expect(documentService.getDocumentById(documentId))
        .rejects
        .toThrow(AppError);
      
      // Verificar que no se intentó leer el archivo
      expect(fs.readFile).not.toHaveBeenCalled();
    });

    it('debería manejar errores de desencriptación', async () => {
      const encryptedDocument = {
        ...mockDocument,
        isEncrypted: true,
        encryptionKey: Buffer.from('test-key').toString('hex')
      };
      
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(encryptedDocument);
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (fs.readFile as jest.Mock).mockResolvedValue(fileContent);
      (fileUploadUtils.decryptFile as jest.Mock).mockImplementation(() => {
        throw new Error('Decryption error');
      });

      // Ejecutar y verificar que lanza error
      await expect(documentService.getDocumentById(documentId, true))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('deleteDocument', () => {
    const documentId = 1;
    const mockDocument = {
      id: 1,
      name: 'Test Document',
      type: 'CV',
      fileType: 'pdf',
      fileUrl: '/uploads/test-file.pdf',
      isEncrypted: false,
      candidateId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('debería eliminar un documento correctamente', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      (fileUploadUtils.deleteFile as jest.Mock).mockResolvedValue(undefined);
      mockPrisma.document.delete.mockResolvedValue(mockDocument);

      // Ejecutar el método
      const result = await documentService.deleteDocument(documentId);

      // Verificar resultado
      expect(result.success).toBe(true);
      expect(result.message).toContain('eliminado exitosamente');
      expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({
        where: { id: documentId }
      });
      expect(fileUploadUtils.deleteFile).toHaveBeenCalledWith(mockDocument.fileUrl);
      expect(mockPrisma.document.delete).toHaveBeenCalledWith({
        where: { id: documentId }
      });
    });

    it('debería devolver error si el documento no existe', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(null);

      // Ejecutar y verificar que lanza error
      await expect(documentService.deleteDocument(documentId))
        .rejects
        .toThrow(AppError);
      
      // Verificar que no se intentó eliminar el archivo ni el registro
      expect(fileUploadUtils.deleteFile).not.toHaveBeenCalled();
      expect(mockPrisma.document.delete).not.toHaveBeenCalled();
    });

    it('debería manejar errores al eliminar el archivo', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      (fileUploadUtils.deleteFile as jest.Mock).mockRejectedValue(new Error('Error deleting file'));

      // Ejecutar y verificar que lanza error
      await expect(documentService.deleteDocument(documentId))
        .rejects
        .toThrow(AppError);
      
      // Verificar que no se intentó eliminar el registro
      expect(mockPrisma.document.delete).not.toHaveBeenCalled();
    });

    it('debería manejar errores de base de datos', async () => {
      // Configurar mocks
      mockPrisma.document.findUnique.mockResolvedValue(mockDocument);
      (fileUploadUtils.deleteFile as jest.Mock).mockResolvedValue(undefined);
      mockPrisma.document.delete.mockRejectedValue(new Error('Database error'));

      // Ejecutar y verificar que lanza error
      await expect(documentService.deleteDocument(documentId))
        .rejects
        .toThrow(AppError);
    });
  });
}); 