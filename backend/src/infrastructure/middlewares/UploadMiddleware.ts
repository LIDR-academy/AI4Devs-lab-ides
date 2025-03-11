import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

export class UploadMiddleware {
  private storage: multer.StorageEngine;
  private fileFilter: multer.Options['fileFilter'];
  private upload: multer.Multer;

  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${fileExtension}`);
      }
    });

    this.fileFilter = (req, file, cb) => {
      const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
      }
    };

    this.upload = multer({ 
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }

  single(fieldName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      this.upload.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
          }
          return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    };
  }
} 