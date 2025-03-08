import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { createOperationalError } from '../../../interfaces/http/middleware/errorHandlerMiddleware';
import crypto from 'crypto';

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string,
    private accessTokenExpiry: string = '1h'
  ) {}

  async execute(data: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    // Buscar usuario por refresh token
    const user = await this.userRepository.findByRefreshToken(data.refreshToken);
    
    // Si no se encuentra el usuario o el refresh token no coincide
    if (!user) {
      throw createOperationalError(
        'Token de refresco inválido',
        401,
        'INVALID_REFRESH_TOKEN'
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

    // Generar un nuevo access token
    const accessToken = jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: this.accessTokenExpiry }
    );

    // Generar un nuevo refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    // Actualizar el refresh token en el usuario
    user.setRefreshToken(refreshToken);
    await this.userRepository.update(user);

    // Devolver los nuevos tokens
    return {
      accessToken,
      refreshToken,
    };
  }
} 