import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && req.path === '/api/candidates') {
    console.log('Body:', req.body); // Para debugging
    console.log('File:', req.file); // Para debugging
    console.log('Headers:', req.headers['content-type']); // Para debugging

    // Validar que sea multipart/form-data
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
      throw new AppError(400, 'El contenido debe ser multipart/form-data');
    }

    // Los datos vendrán como campos individuales en el body
    const { nombre, apellido, correo, telefono, direccion, educacion, experiencia } = req.body;
    const file = req.file;

    // Validar campos requeridos uno por uno para mejor feedback
    const camposFaltantes = [];
    
    if (!nombre) camposFaltantes.push('nombre');
    if (!apellido) camposFaltantes.push('apellido');
    if (!correo) camposFaltantes.push('correo');
    if (!telefono) camposFaltantes.push('teléfono');
    if (!direccion) camposFaltantes.push('dirección');
    if (!educacion) camposFaltantes.push('educación');
    if (!experiencia) camposFaltantes.push('experiencia');
    if (!file) camposFaltantes.push('CV');

    if (camposFaltantes.length > 0) {
      throw new AppError(400, `Los siguientes campos son requeridos: ${camposFaltantes.join(', ')}`);
    }

    // Si llegamos aquí, todos los campos requeridos están presentes
    // Ahora validamos el formato de correo y teléfono
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      throw new AppError(400, 'Formato de correo electrónico inválido');
    }

    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(telefono)) {
      throw new AppError(400, 'Formato de teléfono inválido');
    }
  }

  next();
}; 