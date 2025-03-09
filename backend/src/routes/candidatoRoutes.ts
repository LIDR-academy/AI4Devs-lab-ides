import express from 'express';
import { 
  crearCandidato, 
  subirCVCandidato, 
  obtenerCandidatoPorId,
  upload
} from '../controllers/candidatoController';

const router = express.Router();

// Endpoint para crear un nuevo candidato
router.post('/', crearCandidato);

// Endpoint para subir CV de un candidato
router.post('/:id_candidato/documentos', upload.single('archivo'), subirCVCandidato);

// Endpoint para obtener un candidato por ID
router.get('/:id_candidato', obtenerCandidatoPorId);

export default router; 