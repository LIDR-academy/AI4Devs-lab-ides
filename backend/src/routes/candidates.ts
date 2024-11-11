import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadFile } from '../utils/fileUpload';
import { PrismaClient } from '@prisma/client';
import cloudinary from '../config/cloudinary';
import axios from 'axios';

const router = express.Router();
const prisma = new PrismaClient();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
    }
  }
});

router.post('/', upload.single('cv'), async (req: MulterRequest, res: Response) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      educacion,
      experiencia
    } = req.body;

    // Parse JSON strings back to objects
    const educacionArray = JSON.parse(educacion || '[]');
    const experienciaArray = JSON.parse(experiencia || '[]');

    // Validar campos requeridos
    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Subir CV a Cloudinary si existe
    let cvUrl = '';
    if (req.file) {
      cvUrl = await uploadFile(req.file);
    }

    // Crear candidato con relaciones
    const candidate = await prisma.candidate.create({
      data: {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        cvUrl,
        educacion: {
            create: educacionArray.map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null
          }))
        },
        experiencia: {
          create: experienciaArray.map((exp: any) => ({
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description
          }))
        }
      },
      include: {
        educacion: true,
        experiencia: true
      }
    });

    return res.status(201).json(candidate);
  } catch (error) {
    console.error('Error al crear candidato:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        educacion: true,
        experiencia: true
      }
    });
    return res.json(candidates);
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint para borrar todos los registros de candidatos
router.delete('/cleanup/all', async (req: Request, res: Response) => {
  try {
    // Borrar todos los registros relacionados primero
    await prisma.education.deleteMany({});
    await prisma.experience.deleteMany({});
    
    // Luego borrar los candidatos
    const deletedCandidates = await prisma.candidate.deleteMany({});

    res.status(200).json({ 
      message: `Se eliminaron ${deletedCandidates.count} candidatos y sus registros relacionados`,
      deletedCount: deletedCandidates.count
    });

  } catch (error) {
    console.error('Error al eliminar registros:', error);
    res.status(500).json({ 
      message: 'Error al eliminar registros',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/download-cv', async (req: Request, res: Response) => {
  try {
    const { cvUrl } = req.body; // cvUrl ahora es el public_id
    
    if (!cvUrl) {
      return res.status(400).json({ message: 'ID del CV no proporcionado' });
    }

    // Generar URL firmada
    const signedUrl = cloudinary.utils.private_download_url(cvUrl, 'pdf', {
      resource_type: 'raw',
      type: 'private',
      expires_at: Math.floor(Date.now() / 1000) + 300 // URL válida por 5 minutos
    });

    // Obtener el archivo usando la URL firmada
    const response = await axios({
      url: signedUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    // Configurar headers para la descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    
    return res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('Error al descargar CV:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error:', {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data
      });
    }
    return res.status(500).json({ 
      message: 'Error al descargar el CV',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Ruta para eliminar un candidato específico
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Primero eliminamos los registros relacionados
    await prisma.education.deleteMany({
      where: { candidateId: id }
    });

    await prisma.experience.deleteMany({
      where: { candidateId: id }
    });

    // Obtenemos el candidato para conseguir el cvUrl antes de eliminarlo
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    // Eliminamos el candidato
    const deletedCandidate = await prisma.candidate.delete({
      where: { id }
    });

    // Si existe un CV, lo eliminamos de Cloudinary
    if (candidate?.cvUrl) {
      try {
        await cloudinary.uploader.destroy(candidate.cvUrl, { 
          resource_type: 'raw',
          type: 'private'
        });
      } catch (cloudinaryError) {
        console.error('Error al eliminar archivo de Cloudinary:', cloudinaryError);
      }
    }

    return res.json({ 
      message: 'Candidato eliminado exitosamente',
      deletedCandidate 
    });

  } catch (error) {
    console.error('Error al eliminar candidato:', error);
    return res.status(500).json({ 
      message: 'Error al eliminar el candidato',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router; 