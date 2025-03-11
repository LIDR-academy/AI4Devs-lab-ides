import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { isAllowedFileType, MAX_FILE_SIZE } from '../utils/fileUploadUtils';

// Extender la interfaz Request para incluir el archivo subido
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro para validar archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('Validando archivo:', file.originalname, file.mimetype, file.size);
  
  // Verificar si el tipo de archivo es permitido
  if (!isAllowedFileType(file.mimetype)) {
    console.log('Tipo de archivo no permitido:', file.mimetype);
    return cb(new AppError(
      'Tipo de archivo no permitido. Solo se permiten PDF, DOCX, DOC y TXT.',
      400,
      'INVALID_FILE_TYPE'
    ));
  }
  
  console.log('Archivo validado correctamente');
  // Aceptar el archivo
  cb(null, true);
};

// Configuración de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // 10MB
  },
});

/**
 * Middleware para manejar errores de multer
 */
export const handleMulterErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error('Error en la carga de archivos:', err);
  }
  
  if (err instanceof multer.MulterError) {
    // Errores específicos de multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      console.error('El archivo excede el tamaño máximo permitido');
      return next(new AppError(
        'El archivo excede el tamaño máximo permitido (10MB).',
        400,
        'FILE_TOO_LARGE'
      ));
    }
    
    console.error('Error de multer:', err.code, err.message);
    return next(new AppError(
      `Error en la carga de archivos: ${err.message}`,
      400,
      'FILE_UPLOAD_ERROR'
    ));
  }
  
  // Pasar otros errores al siguiente middleware
  next(err);
};

/**
 * Middleware para validar documentos de candidatos
 */
export const validateCandidateDocuments = (req: Request, res: Response, next: NextFunction) => {
  console.log('Validando documentos del candidato');
  console.log('Archivos recibidos:', req.file ? 1 : 0);
  
  // Si no hay archivos, continuar
  if (!req.file) {
    console.log('No se recibió ningún archivo');
    return next();
  }
  
  console.log('Archivo recibido:', req.file.originalname, req.file.mimetype, req.file.size);
  
  // Verificar que no se excedan 5 documentos
  if (req.files && Array.isArray(req.files) && req.files.length > 5) {
    console.error('Se intentaron subir más de 5 documentos');
    return next(new AppError(
      'No se pueden subir más de 5 documentos por candidato.',
      400,
      'TOO_MANY_FILES'
    ));
  }
  
  console.log('Validación de documentos completada');
  next();
}; 