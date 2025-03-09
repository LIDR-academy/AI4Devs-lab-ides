import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const prisma = new PrismaClient();

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/cv');
    
    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const candidatoId = req.params.id_candidato;
    const fileExt = path.extname(file.originalname);
    const fileName = `CV_${candidatoId}_${Date.now()}${fileExt}`;
    cb(null, fileName);
  }
});

// Filtro para permitir solo archivos PDF y DOCX
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no válido. Solo se permiten archivos PDF o DOCX.'));
  }
};

// Configuración de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

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

    // Validar campos obligatorios
    if (!nombre || !apellido || !email || !telefono) {
      return res.status(400).json({ 
        error: 'Los campos nombre, apellido, email y teléfono son obligatorios.' 
      });
    }

    // Verificar si el email ya existe
    const candidatoExistente = await prisma.candidato.findUnique({
      where: { email }
    });

    if (candidatoExistente) {
      return res.status(400).json({ 
        error: 'Ya existe un candidato con este correo electrónico.' 
      });
    }

    // Crear el candidato
    const nuevoCandidato = await prisma.candidato.create({
      data: {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        // Crear registros de educación si se proporcionan
        educacion: educacion ? {
          create: educacion.map((edu: any) => ({
            institucion: edu.institucion,
            titulo: edu.titulo,
            fechaInicio: new Date(edu.fecha_inicio),
            fechaFin: edu.fecha_fin ? new Date(edu.fecha_fin) : null
          }))
        } : undefined,
        // Crear registros de experiencia laboral si se proporcionan
        experienciaLaboral: experiencia_laboral ? {
          create: experiencia_laboral.map((exp: any) => ({
            empresa: exp.empresa,
            puesto: exp.puesto,
            fechaInicio: new Date(exp.fecha_inicio),
            fechaFin: exp.fecha_fin ? new Date(exp.fecha_fin) : null,
            descripcion: exp.descripcion
          }))
        } : undefined
      }
    });

    return res.status(201).json({
      message: 'Candidato añadido exitosamente.',
      id_candidato: nuevoCandidato.id
    });
  } catch (error: any) {
    console.error('Error al crear candidato:', error);
    
    // Manejar errores de validación de fechas
    if (error.message.includes('Invalid Date')) {
      return res.status(400).json({ 
        error: 'Formato de fecha inválido. Utilice el formato YYYY-MM-DD.' 
      });
    }
    
    return res.status(500).json({ 
      error: 'Error interno del servidor al crear el candidato.' 
    });
  }
};

// Subir CV de un candidato
export const subirCVCandidato = async (req: Request, res: Response) => {
  try {
    const { id_candidato } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo.' });
    }

    // Verificar si el candidato existe
    const candidato = await prisma.candidato.findUnique({
      where: { id: parseInt(id_candidato) }
    });

    if (!candidato) {
      // Eliminar el archivo si el candidato no existe
      fs.unlinkSync(file.path);
      return res.status(404).json({ error: 'Candidato no encontrado.' });
    }

    // Crear registro del documento en la base de datos
    const rutaRelativa = `/uploads/cv/${file.filename}`;
    
    const documento = await prisma.documento.create({
      data: {
        candidatoId: parseInt(id_candidato),
        tipoDocumento: 'CV',
        nombreArchivo: file.originalname,
        rutaArchivo: rutaRelativa,
      }
    });

    return res.status(200).json({
      message: 'CV cargado exitosamente.',
      nombre_archivo: file.originalname,
      ruta_archivo: rutaRelativa
    });
  } catch (error) {
    console.error('Error al subir CV:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al subir el CV.' 
    });
  }
};

// Obtener candidato por ID
export const obtenerCandidatoPorId = async (req: Request, res: Response) => {
  try {
    const { id_candidato } = req.params;

    const candidato = await prisma.candidato.findUnique({
      where: { id: parseInt(id_candidato) },
      include: {
        educacion: true,
        experienciaLaboral: true,
        documentos: true
      }
    });

    if (!candidato) {
      return res.status(404).json({ error: 'Candidato no encontrado.' });
    }

    // Formatear la respuesta según el formato requerido
    const respuesta = {
      id: candidato.id,
      nombre: candidato.nombre,
      apellido: candidato.apellido,
      email: candidato.email,
      telefono: candidato.telefono,
      direccion: candidato.direccion,
      educacion: candidato.educacion.map(edu => ({
        institucion: edu.institucion,
        titulo: edu.titulo,
        fecha_inicio: edu.fechaInicio.toISOString().split('T')[0],
        fecha_fin: edu.fechaFin ? edu.fechaFin.toISOString().split('T')[0] : null
      })),
      experiencia_laboral: candidato.experienciaLaboral.map(exp => ({
        empresa: exp.empresa,
        puesto: exp.puesto,
        fecha_inicio: exp.fechaInicio.toISOString().split('T')[0],
        fecha_fin: exp.fechaFin ? exp.fechaFin.toISOString().split('T')[0] : null,
        descripcion: exp.descripcion
      })),
      documentos: candidato.documentos.map(doc => ({
        tipo_documento: doc.tipoDocumento,
        nombre_archivo: doc.nombreArchivo,
        ruta_archivo: doc.rutaArchivo
      }))
    };

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error al obtener candidato:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al obtener el candidato.' 
    });
  }
}; 