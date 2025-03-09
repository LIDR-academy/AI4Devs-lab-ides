import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure uploads directory exists using an absolute path from project root
const uploadDir = path.join(process.cwd(), 'uploads');
console.log('Upload directory path:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log('Creating uploads directory');
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    console.log('Setting file destination to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `resume-${uniqueSuffix}${ext}`;
    console.log('Setting filename to:', filename);
    cb(null, filename);
  }
});

// File filter to allow only specific file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept PDF, DOC, DOCX files
  const allowedFileTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  console.log('Checking file type:', file.originalname, ext);
  
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    console.log('File type rejected:', ext);
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
};

// Create and export the multer middleware
export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  }
}).single('resume'); // 'resume' is the field name in the form

// Helper function to handle file uploads
export const handleFileUpload = (req: Request): Promise<Express.Multer.File | null> => {
  return new Promise((resolve, reject) => {
    console.log('Starting file upload process');
    uploadResume(req, req.res as any, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return reject(err);
      }
      
      if (!req.file) {
        console.log('No file was uploaded');
        return resolve(null);
      }
      
      console.log('File uploaded successfully:', req.file.filename);
      resolve(req.file);
    });
  });
}; 