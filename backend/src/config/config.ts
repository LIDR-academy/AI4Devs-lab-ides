import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración de la aplicación
 */
export const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/LTIdb',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    cookieName: 'auth_token',
    cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE || '604800000'), // 7 días en milisegundos
  },
  bcrypt: {
    saltRounds: 10,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  uploads: {
    maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '10485760'), // 10MB en bytes
    directory: process.env.UPLOAD_DIR || 'uploads',
  },
}; 