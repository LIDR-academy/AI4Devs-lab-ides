import { Express } from 'express';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      language: string;
      file?: Express.Multer.File;
    }
  }
}