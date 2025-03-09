import { FileUploader } from '../../domain/services/FileUploader';
import fs from 'fs/promises';
import path from 'path';

export class LocalFileUploader implements FileUploader {
  private uploadDir: string;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = uploadDir;
    this.ensureUploadDirectoryExists();
  }

  private async ensureUploadDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.rename(file.path, filePath);

    // En un entorno real, esto sería una URL completa
    return `/uploads/${fileName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      return;
    }

    const fileName = path.basename(fileUrl);
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw new Error('Error deleting file');
    }
  }
} 