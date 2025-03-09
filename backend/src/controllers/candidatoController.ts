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

/**
 * @swagger
 * /api/candidatos:
 *   get:
 *     summary: Obtener todos los candidatos
 *     description: Devuelve una lista de todos los candidatos registrados en el sistema
 *     tags: [Candidatos]
 *     responses:
 *       200:
 *         description: Lista de candidatos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidato'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const obtenerCandidatos = async (req: Request, res: Response) => {
  try {
    const candidatos = await prisma.candidato.findMany({
      include: {
        educacion: true,
        experienciaLaboral: true,
        documentos: true
      }
    });

    // Formatear la respuesta
    const respuesta = candidatos.map(candidato => ({
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
    }));

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al obtener los candidatos.' 
    });
  }
};

/**
 * @swagger
 * /api/candidatos:
 *   post:
 *     summary: Crear un nuevo candidato
 *     description: Crea un nuevo candidato con su información personal, educación y experiencia laboral
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *               - telefono
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@email.com
 *               telefono:
 *                 type: string
 *                 example: +34912345678
 *               direccion:
 *                 type: string
 *                 example: Calle Ficticia 123, Ciudad
 *               educacion:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - institucion
 *                     - titulo
 *                     - fecha_inicio
 *                   properties:
 *                     institucion:
 *                       type: string
 *                       example: Universidad de Madrid
 *                     titulo:
 *                       type: string
 *                       example: Licenciado en Psicología
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                       example: 2015-09-01
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *                       example: 2019-06-30
 *               experiencia_laboral:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - empresa
 *                     - puesto
 *                     - fecha_inicio
 *                   properties:
 *                     empresa:
 *                       type: string
 *                       example: Empresa XYZ
 *                     puesto:
 *                       type: string
 *                       example: Psicólogo Clínico
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                       example: 2020-01-01
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *                       example: 2023-01-01
 *                     descripcion:
 *                       type: string
 *                       example: Atención a pacientes, diagnóstico y seguimiento.
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Candidato añadido exitosamente.
 *                 id_candidato:
 *                   type: integer
 *                   example: 12345
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/candidatos/{id_candidato}/documentos:
 *   post:
 *     summary: Subir CV de un candidato
 *     description: Sube el CV de un candidato en formato PDF o DOCX
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id_candidato
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - archivo
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CV en formato PDF o DOCX (máx. 5MB)
 *     responses:
 *       200:
 *         description: CV cargado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CV cargado exitosamente.
 *                 nombre_archivo:
 *                   type: string
 *                   example: CV_Juan_Perez.pdf
 *                 ruta_archivo:
 *                   type: string
 *                   example: /uploads/cv/CV_12345_1620000000000.pdf
 *       400:
 *         description: Archivo no proporcionado o formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Candidato no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/candidatos/{id_candidato}:
 *   get:
 *     summary: Obtener candidato por ID
 *     description: Obtiene los datos completos de un candidato específico, incluyendo su información personal, educación, experiencia laboral y documentos
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id_candidato
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Datos del candidato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidato'
 *       404:
 *         description: Candidato no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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