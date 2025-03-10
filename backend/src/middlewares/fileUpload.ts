import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Configuración para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/cvs');
    
    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `cv-${uniqueSuffix}${fileExt}`);
  }
});

// Filtro para permitir solo ciertos tipos de archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedFileTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten PDF, DOC y DOCX.'));
  }
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  }
});

// Middleware para manejar errores de carga de archivos
export const handleFileUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.' 
      });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Exportar el middleware configurado para CV
export const uploadCV = upload.single('cv'); 