import express, { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import {
  crearCandidato,
  obtenerCandidatos,
  obtenerCandidato,
  obtenerCV,
  actualizarCandidato,
  eliminarCandidato
} from '../controllers/candidatoController';

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo tamaño de archivo
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
  },
});

// Rutas para candidatos
router.post('/', upload.single('cv'), crearCandidato);
router.get('/', obtenerCandidatos);
router.get('/:id', obtenerCandidato);
router.get('/:id/cv', obtenerCV);
router.put('/:id', upload.single('cv'), actualizarCandidato);
router.delete('/:id', eliminarCandidato);

export default router; 