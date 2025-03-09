import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

// Asegurar que el directorio de uploads existe
const uploadDir = path.join(__dirname, '../../uploads/cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = (multer as any).diskStorage({
  destination: function(req: Request, file: any, cb: any) {
    cb(null, uploadDir);
  },
  filename: function(req: Request, file: any, cb: any) {
    // Generar nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtro de archivos
const fileFilter = function(req: Request, file: any, cb: any) {
  // Verificar tipo de archivo (solo PDF y DOCX)
  const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(createError('Tipo de archivo no permitido. Solo se aceptan PDF y DOCX.', 400, 'INVALID_FILE_TYPE'));
  }
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Middleware para subir CV
export const uploadCV = upload.single('cv');

// Manejador de errores de multer
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'El archivo excede el tamaño máximo permitido (5MB).'
        }
      });
    }
    
    // Si es un error personalizado de nuestro fileFilter
    if (err.code && err.message) {
      return res.status(err.statusCode || 400).json({
        success: false,
        error: {
          code: err.code,
          message: err.message
        }
      });
    }
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'FILE_UPLOAD_ERROR',
        message: 'Error al cargar el archivo.'
      }
    });
  }
  
  next();
};

// Función para eliminar un archivo
export const deleteFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return false;
  }
};

// Función para obtener la URL del archivo
export const getFileUrl = (req: Request, filename: string): string => {
  if (!filename) return '';
  
  // En un entorno de producción, esto podría ser una URL a un CDN o servicio de almacenamiento
  const protocol = req.protocol;
  const host = req.get('host');
  
  return `${protocol}://${host}/uploads/cv/${filename}`;
}; 