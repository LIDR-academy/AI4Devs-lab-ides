import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface UserWithoutPassword extends Omit<User, 'passwordHash'> {
  // Campos adicionales si es necesario
}

export interface LoginResponse {
  user: UserWithoutPassword;
  token: string;
} 