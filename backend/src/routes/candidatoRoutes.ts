import express from 'express';
import {
  crearCandidato,
  obtenerCandidatos,
  obtenerCandidato,
  obtenerCV,
  actualizarCandidato,
  eliminarCandidato
} from '../controllers/candidatoController';
import { validarDatosCandidato } from '../middlewares/validacionCandidato';
import { upload, verificarCV, manejarErroresMulter } from '../middlewares/uploadCV';

const router = express.Router();

// Rutas para candidatos
router.post(
  '/', 
  upload.single('cv'),
  manejarErroresMulter,
  validarDatosCandidato,
  verificarCV,
  crearCandidato
);

router.get('/', obtenerCandidatos);
router.get('/:id', obtenerCandidato);
router.get('/:id/cv', obtenerCV);

router.put(
  '/:id', 
  upload.single('cv'),
  manejarErroresMulter,
  validarDatosCandidato,
  verificarCV,
  actualizarCandidato
);

router.delete('/:id', eliminarCandidato);

export default router; 