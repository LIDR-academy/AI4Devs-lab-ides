import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuración para almacenar archivos en memoria temporalmente
// Los archivos se guardarán permanentemente en el controlador
const storage = multer.memoryStorage();

// Filtro para permitir solo archivos PDF y DOCX
const fileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExtensions = ['.pdf', '.docx'];
  
  const mimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  const extname = path.extname(file.originalname).toLowerCase();
  const extensionValid = allowedExtensions.includes(extname);
  
  if (mimeTypeValid && extensionValid) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF o DOCX'));
  }
};

// Configuración de multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
});

export default upload;
