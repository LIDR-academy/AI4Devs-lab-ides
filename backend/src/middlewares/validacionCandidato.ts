import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para validar los datos de un candidato
 */
export const validarDatosCandidato = (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono
    } = req.body;

    const errores = [];

    // Validar campos obligatorios
    if (!nombre) {
      errores.push('El nombre es obligatorio');
    } else if (nombre.length < 2) {
      errores.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!apellido) {
      errores.push('El apellido es obligatorio');
    } else if (apellido.length < 2) {
      errores.push('El apellido debe tener al menos 2 caracteres');
    }

    if (!email) {
      errores.push('El email es obligatorio');
    } else {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errores.push('El formato del email no es válido');
      }
    }

    if (!telefono) {
      errores.push('El teléfono es obligatorio');
    } else {
      // Validar formato internacional de teléfono (básico)
      const telefonoRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
      if (!telefonoRegex.test(telefono)) {
        errores.push('El formato del teléfono no es válido');
      }
    }

    // Si hay errores, retornar respuesta con errores
    if (errores.length > 0) {
      return res.status(400).json({
        error: 'Validación fallida',
        mensajes: errores
      });
    }

    // Si no hay errores, continuar con el siguiente middleware
    next();
  } catch (error) {
    console.error('Error en validación de datos de candidato:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'Ocurrió un error al validar los datos del candidato'
    });
  }
}; 