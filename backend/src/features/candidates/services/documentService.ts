import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../../utils/AppError';
import { ServiceResponse } from '../../../types/ServiceResponse';
import { 
  saveFile, 
  generateUniqueFileName, 
  getFileExtension,
  encryptFile,
  generateEncryptionKey,
  decryptFile,
  deleteFile
} from '../../../utils/fileUploadUtils';
import fs from 'fs/promises';

const prisma = new PrismaClient();

/**
 * Interfaz para la creación de documentos
 */
interface CreateDocumentData {
  name: string;
  type: 'CV' | 'Cover Letter' | 'Certificate' | 'Other';
  fileType: 'pdf' | 'docx' | 'doc' | 'txt';
  isEncrypted: boolean;
  candidateId: number;
  file: Buffer;
  originalName: string;
  mimeType: string;
}

/**
 * Servicio para manejar los documentos de los candidatos
 */
export class DocumentService {
  /**
   * Crea un nuevo documento para un candidato
   * @param data Datos del documento
   * @returns Respuesta del servicio con el documento creado
   */
  async createDocument(data: CreateDocumentData): Promise<ServiceResponse> {
    try {
      console.log('Iniciando creación de documento en el servicio');
      
      // Verificar que el candidato existe
      const candidate = await prisma.candidate.findUnique({
        where: { id: data.candidateId },
      });

      if (!candidate) {
        console.error(`Candidato con ID ${data.candidateId} no encontrado`);
        throw new AppError('Candidato no encontrado', 404, 'CANDIDATE_NOT_FOUND');
      }

      console.log(`Candidato encontrado: ${candidate.firstName} ${candidate.lastName}`);

      // Generar nombre único para el archivo
      const extension = getFileExtension(data.mimeType);
      const fileName = generateUniqueFileName(data.originalName, extension);
      console.log(`Nombre de archivo generado: ${fileName}`);
      
      // Procesar el archivo (encriptar si es necesario)
      let fileBuffer = data.file;
      let encryptionKey: Buffer | null = null;
      
      if (data.isEncrypted) {
        console.log('Encriptando archivo...');
        encryptionKey = generateEncryptionKey();
        fileBuffer = encryptFile(fileBuffer, encryptionKey);
        console.log('Archivo encriptado correctamente');
      }
      
      // Guardar el archivo en el sistema de archivos
      console.log('Guardando archivo en el sistema de archivos...');
      const filePath = await saveFile(fileBuffer, fileName);
      console.log(`Archivo guardado en: ${filePath}`);
      
      // Crear el registro del documento en la base de datos
      console.log('Creando registro en la base de datos...');
      const document = await prisma.document.create({
        data: {
          name: data.name,
          type: data.type,
          fileUrl: filePath,
          fileType: data.fileType,
          isEncrypted: data.isEncrypted,
          encryptionKey: data.isEncrypted ? encryptionKey?.toString('hex') : null,
          candidateId: data.candidateId,
        },
      });
      
      // Registrar la actividad en el log
      console.log(`Documento "${data.name}" creado para el candidato ID: ${data.candidateId}`);
      
      return {
        success: true,
        data: {
          id: document.id,
          name: document.name,
          type: document.type,
          fileType: document.fileType,
          isEncrypted: document.isEncrypted,
          createdAt: document.createdAt,
        },
        message: 'Documento creado exitosamente',
      };
    } catch (error) {
      console.error('Error en el servicio de documentos:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('Error al crear documento:', error);
      throw new AppError(
        'Error al crear el documento',
        500,
        'DOCUMENT_CREATION_ERROR'
      );
    }
  }

  /**
   * Obtiene los documentos de un candidato
   * @param candidateId ID del candidato
   * @returns Respuesta del servicio con los documentos del candidato
   */
  async getCandidateDocuments(candidateId: number): Promise<ServiceResponse> {
    try {
      console.log('Obteniendo documentos del candidato ID:', candidateId);
      
      // Verificar que el candidato existe
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
      });

      if (!candidate) {
        console.error(`Candidato con ID ${candidateId} no encontrado`);
        throw new AppError('Candidato no encontrado', 404, 'CANDIDATE_NOT_FOUND');
      }

      console.log(`Candidato encontrado: ${candidate.firstName} ${candidate.lastName}`);

      // Obtener los documentos del candidato
      const documents = await prisma.document.findMany({
        where: { candidateId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          type: true,
          fileType: true,
          fileUrl: true,
          isEncrypted: true,
          createdAt: true,
        },
      });
      
      console.log(`Se encontraron ${documents.length} documentos para el candidato ID: ${candidateId}`);
      
      return {
        success: true,
        data: documents,
        message: 'Documentos obtenidos exitosamente',
      };
    } catch (error) {
      console.error('Error en el servicio de documentos:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('Error al obtener documentos del candidato:', error);
      throw new AppError(
        'Error al obtener los documentos del candidato',
        500,
        'DOCUMENT_RETRIEVAL_ERROR'
      );
    }
  }

  /**
   * Obtiene un documento por su ID
   * @param id ID del documento
   * @param decrypt Indica si se debe desencriptar el documento
   * @returns Respuesta del servicio con el documento y su contenido
   */
  async getDocumentById(id: number, decrypt: boolean = false): Promise<ServiceResponse> {
    try {
      console.log(`Obteniendo documento ID: ${id}, decrypt: ${decrypt}`);
      
      // Buscar el documento en la base de datos
      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        console.error(`Documento con ID ${id} no encontrado`);
        throw new AppError('Documento no encontrado', 404, 'DOCUMENT_NOT_FOUND');
      }

      console.log(`Documento encontrado: ${document.name}, fileUrl: ${document.fileUrl}, isEncrypted: ${document.isEncrypted}`);
      
      // Verificar que el archivo existe
      try {
        await fs.access(document.fileUrl);
        console.log(`Archivo verificado en: ${document.fileUrl}`);
      } catch (fileError) {
        console.error(`Error al acceder al archivo: ${document.fileUrl}`, fileError);
        throw new AppError('Archivo no encontrado', 404, 'FILE_NOT_FOUND');
      }
      
      // Leer el contenido del archivo
      let fileBuffer = await fs.readFile(document.fileUrl);
      console.log(`Archivo leído, tamaño: ${fileBuffer.length} bytes`);
      
      // Desencriptar si es necesario y está encriptado
      if ((decrypt || document.isEncrypted) && document.encryptionKey) {
        console.log('Desencriptando archivo...');
        try {
          const key = Buffer.from(document.encryptionKey, 'hex');
          fileBuffer = decryptFile(fileBuffer, key);
          console.log(`Archivo desencriptado, nuevo tamaño: ${fileBuffer.length} bytes`);
        } catch (decryptError) {
          console.error('Error al desencriptar el archivo:', decryptError);
          throw new AppError('Error al desencriptar el archivo', 500, 'DECRYPTION_ERROR');
        }
      }
      
      return {
        success: true,
        data: {
          document: {
            id: document.id,
            name: document.name,
            type: document.type,
            fileType: document.fileType,
            isEncrypted: document.isEncrypted,
            createdAt: document.createdAt,
          },
          fileBuffer,
          fileUrl: document.fileUrl,
        },
        message: 'Documento obtenido exitosamente',
      };
    } catch (error) {
      console.error('Error en el servicio de documentos:', error);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('Error al obtener documento:', error);
      throw new AppError(
        'Error al obtener el documento',
        500,
        'DOCUMENT_RETRIEVAL_ERROR'
      );
    }
  }

  /**
   * Elimina un documento por su ID
   * @param id ID del documento
   * @returns Respuesta del servicio
   */
  async deleteDocument(id: number): Promise<ServiceResponse> {
    try {
      // Obtener el documento
      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        throw new AppError('Documento no encontrado', 404, 'DOCUMENT_NOT_FOUND');
      }

      // Eliminar el archivo del sistema de archivos
      await deleteFile(document.fileUrl);
      
      // Eliminar el registro de la base de datos
      await prisma.document.delete({
        where: { id },
      });
      
      // Registrar la actividad en el log
      console.log(`Documento "${document.name}" eliminado`);
      
      return {
        success: true,
        message: 'Documento eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error al eliminar documento:', error);
      throw new AppError(
        'Error al eliminar el documento',
        500,
        'DOCUMENT_DELETION_ERROR'
      );
    }
  }
} 