/**
 * Configuración de autenticación
 */
export default {
  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m', // 15 minutos
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d', // 7 días
  },
  
  // Configuración de OAuth
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3010/api/auth/google/callback',
    },
  },
  
  // Configuración para el envío de correos
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@example.com',
  },
  
  // Configuración de seguridad
  security: {
    // Número de rondas de hashing para bcrypt
    saltRounds: 10,
    // Tiempo de bloqueo de cuenta después de múltiples intentos fallidos (en minutos)
    accountLockTime: 30,
    // Número máximo de intentos fallidos antes de bloquear la cuenta
    maxFailedAttempts: 5,
    // Rate limiting
    rateLimit: {
      // Ventana de tiempo para el rate limit (en minutos)
      windowMs: 15 * 60 * 1000, // 15 minutos
      // Número máximo de solicitudes por ventana
      max: 100,
      // Rutas de autenticación (rate limit más estricto)
      auth: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 10, // 10 solicitudes por 15 minutos
      }
    },
    // Orígenes permitidos para CORS
    corsOptions: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  },
}; 