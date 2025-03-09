import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

export const configureMiddleware = (app: express.Express): void => {
  // Security headers
  app.use(helmet());

  // Determina se siamo in modalità sviluppo
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // CORS configuration
  app.use(
    cors({
      // In development, allow any origin, in production use the allowlist
      origin: isDevelopment
        ? true // Abilita CORS per qualsiasi origine in modalità sviluppo
        : ([
            'http://localhost:3000',
            'http://localhost:3002',
            process.env.FRONTEND_URL as string,
          ].filter(Boolean) as string[]),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // JSON body parser
  app.use(express.json());

  // URL-encoded body parser
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  /* Commenting out rate limiting as requested
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', apiLimiter);
  */

  console.log('Rate limiting has been disabled');

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message:
        process.env.NODE_ENV === 'production'
          ? 'Something went wrong'
          : err.message,
    });
  });
};
