import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { DocumentService } from '../services/documentService';
import { AppError } from '../../../utils/AppError';
import { validateRequest } from '../../../middlewares/validationMiddleware';

/**
 * Controlador para manejar los documentos de los candidatos
 */
export class DocumentController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  /**
   * Validadores para la creación de documentos
   */
  createDocumentValidators = [
    body('name')
      .isString()
      .withMessage('El nombre debe ser un texto')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('type')
      .isIn(['CV', 'Cover Letter', 'Certificate', 'Other'])
      .withMessage('El tipo debe ser CV, Cover Letter, Certificate u Other'),
    body('fileType')
      .isIn(['pdf', 'docx', 'doc', 'txt'])
      .withMessage('El tipo de archivo debe ser pdf, docx, doc o txt'),
    body('isEncrypted')
      .isBoolean()
      .withMessage('isEncrypted debe ser un valor booleano'),
    param('candidateId')
      .isInt({ min: 1 })
      .withMessage('El ID del candidato debe ser un número entero positivo'),
  ];

  /**
   * Validadores para obtener un documento
   */
  getDocumentValidators = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID del documento debe ser un número entero positivo'),
  ];

  /**
   * Validadores para eliminar un documento
   */
  deleteDocumentValidators = [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID del documento debe ser un número entero positivo'),
  ];

  /**
   * Obtiene los documentos de un candidato
   */
  getCandidateDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Obteniendo documentos del candidato');
      
      // Obtener el ID del candidato
      const candidateId = parseInt(req.params.candidateId, 10);
      
      if (isNaN(candidateId) || candidateId <= 0) {
        throw new AppError('El ID del candidato debe ser un número entero positivo', 400, 'INVALID_ID');
      }
      
      // Obtener los documentos del candidato
      const result = await this.documentService.getCandidateDocuments(candidateId);
      
      // Enviar respuesta
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener documentos del candidato:', error);
      next(error);
    }
  };

  /**
   * Crea un nuevo documento para un candidato
   */
  createDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Iniciando creación de documento');
      console.log('Datos recibidos:', req.body);
      console.log('Archivo recibido:', req.file ? 'Sí' : 'No');
      
      // Validar la solicitud
      validateRequest(req);

      // Verificar que se ha subido un archivo
      if (!req.file) {
        console.error('No se proporcionó ningún archivo');
        throw new AppError('No se ha proporcionado ningún archivo', 400, 'NO_FILE_UPLOADED');
      }

      const { name, type, fileType, isEncrypted } = req.body;
      const candidateId = parseInt(req.params.candidateId, 10);
      const file = req.file;

      console.log('Procesando documento:', {
        name,
        type,
        fileType,
        isEncrypted: isEncrypted === 'true',
        candidateId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      });

      // Crear el documento
      const result = await this.documentService.createDocument({
        name,
        type,
        fileType,
        isEncrypted: isEncrypted === 'true',
        candidateId,
        file: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });

      console.log('Documento creado exitosamente:', result);

      // Enviar respuesta
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear documento:', error);
      next(error);
    }
  };

  /**
   * Obtiene un documento por su ID
   */
  getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Obteniendo documento por ID');
      console.log('Parámetros:', req.params);
      console.log('Query:', req.query);
      
      // Validar la solicitud
      validateRequest(req);

      const id = parseInt(req.params.id, 10);
      const decrypt = req.query.decrypt === 'true' || req.query.download === 'true'; // Siempre desencriptar al descargar
      const download = req.query.download === 'true';

      console.log(`Obteniendo documento ID: ${id}, decrypt: ${decrypt}, download: ${download}`);

      // Obtener el documento
      const result = await this.documentService.getDocumentById(id, decrypt);

      if (!result.success) {
        return res.status(404).json(result);
      }

      // Si se solicita la descarga, enviar el archivo
      if (download && result.data) {
        console.log(`Preparando archivo para descarga: ${result.data.document.name}.${result.data.document.fileType}`);
        
        try {
          // Configurar las cabeceras para la descarga
          const mimeType = this.getMimeType(result.data.document.fileType);
          res.setHeader('Content-Type', mimeType);
          res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(result.data.document.name)}.${result.data.document.fileType}`);
          res.setHeader('Content-Length', result.data.fileBuffer.length);
          
          // Enviar el buffer del archivo
          return res.send(result.data.fileBuffer);
        } catch (downloadError) {
          console.error('Error al preparar la descarga:', downloadError);
          return res.status(500).json({
            success: false,
            error: 'Error al preparar la descarga del archivo',
          });
        }
      }

      // Enviar respuesta sin el contenido del archivo
      return res.status(200).json({
        success: true,
        data: result.data.document,
        message: 'Documento obtenido exitosamente',
      });
    } catch (error) {
      console.error('Error al obtener documento:', error);
      next(error);
    }
  };

  /**
   * Obtiene el tipo MIME basado en la extensión del archivo
   */
  private getMimeType(fileType: string): string {
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'txt': 'text/plain',
    };
    
    return mimeTypes[fileType] || 'application/octet-stream';
  }

  /**
   * Elimina un documento por su ID
   */
  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar la solicitud
      validateRequest(req);

      const id = parseInt(req.params.id, 10);

      // Eliminar el documento
      const result = await this.documentService.deleteDocument(id);

      // Enviar respuesta
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
} 