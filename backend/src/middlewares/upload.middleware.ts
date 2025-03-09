import multer from 'multer';

// Configure multer storage to store files in memory
const storage = multer.memoryStorage();

// File filter for PDF files
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configure multer with size limits and file filter
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

export default upload;