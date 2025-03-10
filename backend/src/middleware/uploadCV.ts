import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('El archivo CV debe ser en formato PDF o DOCX.'));
  }
};

export const upload = multer({ storage, fileFilter });