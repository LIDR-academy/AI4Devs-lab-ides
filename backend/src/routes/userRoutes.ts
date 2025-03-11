import { Router } from 'express';
import { getUsers, getUserById, addUser, deleteUser, getEducationOptions, getExperienceOptions } from '../controllers/userController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById); // Nueva ruta para obtener los detalles de un usuario
router.post('/users', upload.single('cv'), addUser);
router.delete('/users/:id', deleteUser); // Nueva ruta para eliminar usuario
router.get('/education-options', getEducationOptions);
router.get('/experience-options', getExperienceOptions);

export default router;
