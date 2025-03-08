import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

export class FileService {
  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  /**
   * Generates a secure filename for the uploaded file
   */
  generateSecureFilename(originalFilename: string): string {
    const fileExtension = path.extname(originalFilename);
    const randomString = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${timestamp}-${randomString}${fileExtension}`;
  }

  /**
   * Validates if the file is a PDF or DOCX
   */
  validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return allowedTypes.includes(mimetype);
  }

  /**
   * Saves the file to the upload directory
   */
  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!this.validateFileType(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only PDF and DOCX files are allowed.',
      );
    }

    const secureFilename = this.generateSecureFilename(file.originalname);
    const filePath = path.join(UPLOAD_DIR, secureFilename);

    // Move the file from temp location to our upload directory
    fs.copyFileSync(file.path, filePath);

    // Remove the temp file
    if (fs.existsSync(file.path)) {
      await unlinkAsync(file.path);
    }

    return secureFilename;
  }

  /**
   * Deletes a file from the upload directory
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
    }
  }

  /**
   * Gets the full path to a file
   */
  getFilePath(filename: string): string {
    return path.join(UPLOAD_DIR, filename);
  }
}
