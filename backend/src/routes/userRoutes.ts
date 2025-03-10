import express from 'express';
import {
  obtenerUsuarios,
  obtenerUsuario
} from '../controllers/userController';

const router = express.Router();

// Rutas para usuarios
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuario);

export default router; 