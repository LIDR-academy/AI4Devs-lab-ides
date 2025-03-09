import cors from 'cors';
import express from 'express';

/**
 * Configure global middleware for the Express application
 */
export function configureMiddleware(app: express.Application): void {
  // Determina se siamo in modalità sviluppo
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Enable CORS
  app.use(
    cors({
      // In development, allow any origin, in production use the allowlist
      origin: isDevelopment
        ? true // Abilita CORS per qualsiasi origine in modalità sviluppo
        : [
            'http://localhost:3000',
            'http://localhost:3002',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3002',
          ].concat(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // Parse JSON bodies
  app.use(express.json());

  // Parse URL-encoded bodies (e.g., form data)
  app.use(express.urlencoded({ extended: true }));
}
