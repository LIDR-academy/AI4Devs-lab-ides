import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Ensure uploads directory exists and is not publicly accessible
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log('Upload directory:', uploadDir);

// Configure storage with secure naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination called for file:', file.originalname);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a secure random filename to prevent path traversal attacks
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = `${randomName}${ext}`;
    console.log(
      'Generated filename:',
      sanitizedName,
      'for original file:',
      file.originalname,
    );
    cb(null, sanitizedName);
  },
});

// Enhanced file filter with additional security checks
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // If no file is provided, just continue
  if (!file) {
    console.log('No file provided');
    return cb(null, true);
  }

  console.log('Filtering file:', file.originalname, 'mimetype:', file.mimetype);

  // Check file extension
  const allowedFileTypes = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedFileTypes.includes(ext)) {
    console.log('File rejected - invalid extension:', ext);
    return cb(new Error('Only PDF and DOCX files are allowed'));
  }

  // Check MIME type
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.log('File rejected - invalid mimetype:', file.mimetype);
    return cb(new Error('Invalid file type'));
  }

  console.log('File accepted:', file.originalname);
  cb(null, true);
};

// Create the multer instance with stricter limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only allow one file
  },
}).single('cv');

// Create a wrapper middleware with better error handling
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Upload middleware called, files in request:', req.files);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ error: 'File size exceeds the 5MB limit' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown upload error:', err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }

    // Log file upload for audit purposes
    if (req.file) {
      console.log(
        `File uploaded successfully: ${req.file.filename} (${req.file.size} bytes, ${req.file.mimetype})`,
      );
    } else {
      console.log('No file was uploaded with this request');
    }

    // Everything went fine
    next();
  });
};

export default uploadMiddleware;
