import cors from 'cors';
import express from 'express';

/**
 * Configure global middleware for the Express application
 */
export function configureMiddleware(app: express.Application): void {
  // Enable CORS
  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    }),
  );

  // Parse JSON bodies
  app.use(express.json());

  // Parse URL-encoded bodies (e.g., form data)
  app.use(express.urlencoded({ extended: true }));
}
