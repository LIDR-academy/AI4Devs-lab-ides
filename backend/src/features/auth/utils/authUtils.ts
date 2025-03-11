import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/config';
import { TokenPayload } from '../types';
import { Secret, SignOptions } from 'jsonwebtoken';

/**
 * Genera un hash de la contraseña
 * @param password Contraseña en texto plano
 * @returns Hash de la contraseña
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.bcrypt.saltRounds);
};

/**
 * Compara una contraseña en texto plano con un hash
 * @param password Contraseña en texto plano
 * @param hashedPassword Hash de la contraseña almacenada
 * @returns Booleano indicando si la contraseña coincide
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Genera un token JWT
 * @param payload Datos a incluir en el token
 * @returns Token JWT
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret as Secret, {
    expiresIn: config.jwt.expiresIn
  } as SignOptions);
};

/**
 * Verifica un token JWT
 * @param token Token JWT a verificar
 * @returns Payload del token si es válido, null si no lo es
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret as Secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Extrae el token de la cookie o del header de autorización
 * @param req Request de Express
 * @returns Token extraído o null si no existe
 */
export const extractTokenFromRequest = (req: any): string | null => {
  // Intentar obtener el token de la cookie
  if (req.cookies && req.cookies[config.jwt.cookieName]) {
    return req.cookies[config.jwt.cookieName];
  }

  // Intentar obtener el token del header de autorización
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Eliminar 'Bearer ' del inicio
  }

  return null;
}; 