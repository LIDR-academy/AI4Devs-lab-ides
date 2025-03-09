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
   * Validates if the file is a PDF or DOCX (used as backup validation)
   */
  validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return allowedTypes.includes(mimetype);
  }

  /**
   * Gets the filename from a file path
   */
  getFilenameFromPath(filePath: string): string {
    return path.basename(filePath);
  }

  /**
   * Saves the file information and returns the filename
   * Note: The actual file is already saved by multer in the uploads directory
   */
  async saveFile(file: Express.Multer.File): Promise<string> {
    // The file is already in the uploads directory thanks to multer configuration
    // Just return the filename
    return this.getFilenameFromPath(file.path);
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
