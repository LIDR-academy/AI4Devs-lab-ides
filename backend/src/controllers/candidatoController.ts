import { Request, Response } from 'express';
import prisma from '../index';

// Declaración para extender Express Request
declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
  }
}

// Crear un nuevo candidato
export const crearCandidato = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      educacion,
      experiencia_laboral
    } = req.body;

    // Verificar el archivo CV
    if (!req.file) {
      return res.status(400).json({ 
        error: 'El CV es obligatorio',
        mensaje: 'Debe subir un archivo PDF o DOCX como CV'
      });
    }

    const cv = req.file.buffer;

    const candidato = await prisma.candidato.create({
      data: {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        educacion,
        experiencia_laboral,
        cv
      }
    });

    return res.status(201).json({
      mensaje: 'Candidato creado exitosamente',
      data: {
        id: candidato.id,
        nombre: candidato.nombre,
        apellido: candidato.apellido,
        email: candidato.email
      }
    });
  } catch (error: any) {
    // Manejo de errores específicos
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ 
        error: 'Email duplicado',
        mensaje: 'Ya existe un candidato con este correo electrónico'
      });
    }
    
    console.error('Error al crear candidato:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear el candidato'
    });
  }
};

// Obtener todos los candidatos
export const obtenerCandidatos = async (req: Request, res: Response) => {
  try {
    const candidatos = await prisma.candidato.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      mensaje: 'Candidatos recuperados exitosamente',
      data: candidatos
    });
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron recuperar los candidatos'
    });
  }
};

// Obtener un candidato por ID
export const obtenerCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const candidato = await prisma.candidato.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        direccion: true,
        educacion: true,
        experiencia_laboral: true,
        createdAt: true,
        updatedAt: true
        // Nota: No incluimos cv por defecto para reducir la carga de datos
      }
    });

    if (!candidato) {
      return res.status(404).json({ 
        error: 'Candidato no encontrado',
        mensaje: 'El candidato solicitado no existe'
      });
    }

    return res.status(200).json({
      mensaje: 'Candidato recuperado exitosamente',
      data: candidato
    });
  } catch (error) {
    console.error('Error al obtener candidato:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudo recuperar el candidato'
    });
  }
};

// Obtener el CV de un candidato
export const obtenerCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const candidato = await prisma.candidato.findUnique({
      where: { id },
      select: {
        nombre: true,
        apellido: true,
        cv: true
      }
    });

    if (!candidato) {
      return res.status(404).json({ 
        error: 'Candidato no encontrado',
        mensaje: 'El candidato solicitado no existe'
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${candidato.nombre}_${candidato.apellido}_CV.pdf"`);
    
    return res.send(candidato.cv);
  } catch (error) {
    console.error('Error al obtener CV:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudo recuperar el CV del candidato'
    });
  }
};

// Actualizar un candidato
export const actualizarCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      educacion,
      experiencia_laboral
    } = req.body;

    // Verificar que el candidato existe
    const candidatoExistente = await prisma.candidato.findUnique({
      where: { id }
    });

    if (!candidatoExistente) {
      return res.status(404).json({ 
        error: 'Candidato no encontrado',
        mensaje: 'El candidato que intenta actualizar no existe'
      });
    }

    // Preparar datos para actualización
    const datosActualizacion: any = {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      educacion,
      experiencia_laboral
    };

    // Si hay un nuevo CV, actualizarlo
    if (req.file) {
      datosActualizacion.cv = req.file.buffer;
    }

    const candidatoActualizado = await prisma.candidato.update({
      where: { id },
      data: datosActualizacion,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      mensaje: 'Candidato actualizado exitosamente',
      data: candidatoActualizado
    });
  } catch (error: any) {
    // Manejo de errores específicos
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ 
        error: 'Email duplicado',
        mensaje: 'Ya existe otro candidato con este correo electrónico'
      });
    }
    
    console.error('Error al actualizar candidato:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudo actualizar el candidato'
    });
  }
};

// Eliminar un candidato
export const eliminarCandidato = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar que el candidato existe
    const candidatoExistente = await prisma.candidato.findUnique({
      where: { id }
    });

    if (!candidatoExistente) {
      return res.status(404).json({ 
        error: 'Candidato no encontrado',
        mensaje: 'El candidato que intenta eliminar no existe'
      });
    }

    await prisma.candidato.delete({
      where: { id }
    });

    return res.status(200).json({
      mensaje: 'Candidato eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar candidato:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudo eliminar el candidato'
    });
  }
}; 