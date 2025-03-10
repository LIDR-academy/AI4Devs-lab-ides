import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// Configuración de multer para subida de archivos
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Validar tipos de archivo permitidos
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no soportado. Solo se permiten archivos PDF y DOCX.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo tamaño de archivo
  },
  fileFilter
});

/**
 * Middleware que verifica que el archivo CV exista en la solicitud
 */
export const verificarCV = (req: Request, res: Response, next: NextFunction) => {
  // Para rutas PUT, no es obligatorio incluir un nuevo CV
  if (req.method === 'PUT' && !req.file) {
    return next();
  }

  // Para rutas POST, el CV es obligatorio
  if (req.method === 'POST' && !req.file) {
    return res.status(400).json({
      error: 'Archivo faltante',
      mensaje: 'Debe subir un archivo PDF o DOCX como CV'
    });
  }

  next();
};

/**
 * Middleware para manejar errores de multer
 */
export const manejarErroresMulter = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande',
        mensaje: 'El tamaño máximo permitido es 5MB'
      });
    }
    
    return res.status(400).json({
      error: 'Error en la carga del archivo',
      mensaje: err.message
    });
  } else if (err) {
    // Otro tipo de error
    return res.status(400).json({
      error: 'Error en la carga del archivo',
      mensaje: err.message
    });
  }
  
  next();
}; 