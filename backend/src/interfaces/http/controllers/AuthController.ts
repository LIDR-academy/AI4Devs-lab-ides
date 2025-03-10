import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/auth/LoginUserUseCase';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/RefreshTokenUseCase';
import { AppError } from '../middleware/errorHandlerMiddleware';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  /**
   * Registra un nuevo usuario
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, firstName, lastName, role } = req.body;

      const user = await this.registerUserUseCase.execute({
        email,
        password,
        name,
        firstName,
        lastName,
        role
      });

      res.status(201).json({
        success: true,
        data: user.toJSON(),
        message: 'Usuario registrado con éxito'
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      
      const err = error as AppError;
      
      if (err.isOperational) {
        res.status(err.statusCode || 500).json({
          success: false,
          message: err.message,
          code: err.code
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al procesar la solicitud'
        });
      }
    }
  };

  /**
   * Inicia sesión con un usuario existente
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const loginResponse = await this.loginUserUseCase.execute({
        email,
        password
      });

      // Establecer refresh token en cookie httpOnly (más seguro)
      res.cookie('refreshToken', loginResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/api/auth/refresh-token'
      });

      res.status(200).json({
        success: true,
        data: {
          user: loginResponse.user,
          accessToken: loginResponse.accessToken,
        },
        message: 'Inicio de sesión exitoso'
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      
      const err = error as AppError;
      
      if (err.isOperational) {
        res.status(err.statusCode || 500).json({
          success: false,
          message: err.message,
          code: err.code
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al procesar la solicitud'
        });
      }
    }
  };

  /**
   * Refresca el token de acceso usando el refresh token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el refresh token de la cookie o del body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'No se proporcionó un token de refresco'
        });
        return;
      }

      const result = await this.refreshTokenUseCase.execute({ refreshToken });

      // Actualizar la cookie de refreshToken
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/api/auth/refresh-token'
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken
        },
        message: 'Token de acceso renovado con éxito'
      });
    } catch (error) {
      console.error('Error al refrescar token:', error);
      
      const err = error as AppError;
      
      if (err.isOperational) {
        res.status(err.statusCode || 500).json({
          success: false,
          message: err.message,
          code: err.code
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al procesar la solicitud'
        });
      }
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    // Eliminar la cookie de refreshToken
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth/refresh-token'
    });

    res.status(200).json({
      success: true,
      message: 'Sesión cerrada con éxito'
    });
  };
} 