import { Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { AuthRequest } from '../types';
import prisma from '../index';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { candidateId } = req.params;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    const document = await prisma.document.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
        candidateId: parseInt(candidateId),
      },
    });

    res.status(201).json({
      status: 'success',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    
    // Get document details from database
    const document = await prisma.document.findFirst({
      where: { filename }
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      throw new AppError('File not found on server', 404);
    }

    // Set headers for file download
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);

    // Stream the file
    const fileStream = fs.createReadStream(document.path);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};