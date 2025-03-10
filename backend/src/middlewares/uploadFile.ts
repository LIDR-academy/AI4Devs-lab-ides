import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Configuración para almacenar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Verificar si el directorio existe, si no, crearlo
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtro para permitir solo PDF y DOCX
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF o DOCX'));
  }
};

// Configuración de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limitar a 5MB
  }
});

// Middleware para manejar la carga de archivos de CV
export const uploadResume = (req: Request, res: Response, next: NextFunction) => {
  const uploadSingle = upload.single('resume');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      return res.status(400).json({
        success: false,
        message: 'Error al cargar el archivo',
        error: err.message
      });
    } else if (err) {
      // Error personalizado
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // Si se cargó un archivo, añadir la URL al cuerpo de la solicitud
    if (req.file) {
      req.body.resumeUrl = `/uploads/${req.file.filename}`;
    }
    
    next();
  });
}; 