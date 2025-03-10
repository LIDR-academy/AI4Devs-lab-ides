import express from 'express';
import { body } from 'express-validator';
import { authController } from '../../controllers/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { authLimiter } from '../../middlewares/rateLimit';
import { verifyToken } from '../../middlewares/auth/jwt';

const router = express.Router();

// Validaciones para registro de usuario
const registerValidation = [
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe tener al menos una letra mayúscula')
    .matches(/[a-z]/)
    .withMessage('La contraseña debe tener al menos una letra minúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe tener al menos un número')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('La contraseña debe tener al menos un caracter especial'),
  body('name').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
  validateRequest
];

// Validaciones para inicio de sesión
const loginValidation = [
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  validateRequest
];

// Validaciones para renovación de token
const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('El token de actualización es obligatorio'),
  validateRequest
];

// Validaciones para solicitud de restablecimiento de contraseña
const requestResetValidation = [
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  validateRequest
];

// Validaciones para restablecimiento de contraseña
const resetPasswordValidation = [
  body('token').notEmpty().withMessage('El token es obligatorio'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe tener al menos una letra mayúscula')
    .matches(/[a-z]/)
    .withMessage('La contraseña debe tener al menos una letra minúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe tener al menos un número')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('La contraseña debe tener al menos un caracter especial'),
  validateRequest
];

// Rutas de autenticación
router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.post('/refresh-token', authLimiter, refreshTokenValidation, authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/request-reset', authLimiter, requestResetValidation, authController.requestPasswordReset);
router.post('/reset-password', authLimiter, resetPasswordValidation, authController.resetPassword);

export default router; 