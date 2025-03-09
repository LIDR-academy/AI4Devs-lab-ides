import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf'; // Default to .pdf if no extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter to only allow PDF and DOCX
const fileFilter = (
  _: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!file) {
    return cb(null, true); // Allow if no file is provided
  }

  const allowedTypes = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    return cb(null, true);
  }

  cb(new Error('Only PDF and DOCX files are allowed'));
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});
