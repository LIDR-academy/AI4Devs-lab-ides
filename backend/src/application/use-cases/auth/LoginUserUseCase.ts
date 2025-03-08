import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { createOperationalError } from '../../../interfaces/http/middleware/errorHandlerMiddleware';
import crypto from 'crypto';

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string,
    private jwtRefreshSecret: string,
    private accessTokenExpiry: string = '1h',
    private refreshTokenExpiry: string = '7d'
  ) {}

  async execute(data: LoginUserDTO): Promise<LoginResponse> {
    // Buscar el usuario por email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw createOperationalError(
        'Credenciales inválidas',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      throw createOperationalError(
        'Esta cuenta ha sido desactivada',
        403,
        'ACCOUNT_INACTIVE'
      );
    }

    // Verificar si la cuenta está bloqueada por muchos intentos fallidos
    if (user.isLocked()) {
      throw createOperationalError(
        'Esta cuenta ha sido bloqueada temporalmente por seguridad',
        403,
        'ACCOUNT_LOCKED'
      );
    }

    // Validar la contraseña
    const isPasswordValid = user.validatePassword(data.password);
    if (!isPasswordValid) {
      // Incrementar contador de intentos fallidos
      user.incrementFailedAttempts();
      
      // Si tiene 5 o más intentos fallidos, bloquear la cuenta
      if (user.failedLoginAttempts >= 5) {
        user.lock(15); // Bloquear por 15 minutos
      }
      
      // Guardar los cambios
      await this.userRepository.update(user);
      
      throw createOperationalError(
        'Credenciales inválidas',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    // Si llegamos aquí, las credenciales son válidas
    // Generar tokens
    const accessToken = this.generateAccessToken(user.id!);
    const refreshToken = this.generateRefreshToken();
    
    // Actualizar usuario con el refresh token y registrar el login
    user.setRefreshToken(refreshToken);
    user.recordLogin();
    await this.userRepository.update(user);

    // Devolver respuesta con tokens y datos del usuario
    return {
      user: {
        id: user.id!,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(userId: number): string {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }
} 