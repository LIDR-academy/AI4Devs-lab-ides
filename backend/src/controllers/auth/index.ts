import { Request, Response } from 'express';
import { authService } from '../../services/auth';
import { auditLogger } from '../../utils/logger';

/**
 * Controlador para autenticación
 */
export const authController = {
  /**
   * Registrar un nuevo usuario
   */
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      
      const result = await authService.register(email, password, name);
      
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al registrar el usuario'
      });
    }
  },
  
  /**
   * Iniciar sesión
   */
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'] || '';
      
      const result = await authService.login(email, password, ip, userAgent);
      
      return res.status(result.success ? 200 : 401).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al iniciar sesión'
      });
    }
  },
  
  /**
   * Renovar token de acceso
   */
  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere el token de actualización'
        });
      }
      
      const result = await authService.refreshToken(refreshToken);
      
      return res.status(result.success ? 200 : 401).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al renovar el token'
      });
    }
  },
  
  /**
   * Cerrar sesión
   */
  logout: async (req: Request & { userId?: number }, res: Response) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado'
        });
      }
      
      const result = await authService.logout(userId);
      
      return res.status(200).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
  },
  
  /**
   * Verificar correo electrónico
   */
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      
      const result = await authService.verifyEmail(token);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el correo electrónico'
      });
    }
  },
  
  /**
   * Solicitar restablecimiento de contraseña
   */
  requestPasswordReset: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      const result = await authService.requestPasswordReset(email);
      
      return res.status(200).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al solicitar el restablecimiento de contraseña'
      });
    }
  },
  
  /**
   * Restablecer contraseña
   */
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      
      const result = await authService.resetPassword(token, password);
      
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error: any) {
      auditLogger.error(error, req);
      
      return res.status(500).json({
        success: false,
        message: 'Error al restablecer la contraseña'
      });
    }
  }
}; 