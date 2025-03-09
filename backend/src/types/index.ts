import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
type User = typeof prisma.user;

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'RECRUITER';
}