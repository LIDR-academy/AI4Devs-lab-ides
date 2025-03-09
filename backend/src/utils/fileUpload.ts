import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

// Directory for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const filename = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// File filter to allow specific file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Extract file extension
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Allow common document/PDF types
  const allowed = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} not allowed. Allowed types: ${allowed.join(', ')}`));
  }
};

// Multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter
});

// Handler function to process file upload
export const handleFileUpload = async (req: Request): Promise<Express.Multer.File | null> => {
  try {
    // Create a Promise-based wrapper around multer's single upload
    return await new Promise((resolve, reject) => {
      const singleUpload = upload.single('resume');
      
      singleUpload(req, {} as Response, (err) => {
        if (err) {
          console.error('File upload error:', err);
          reject(err);
          return;
        }
        
        if (req.file) {
          resolve(req.file);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in handleFileUpload:', error);
    return null;
  }
}; 