import { FileUploader } from '../../../domain/services/FileUploader';

export class MockFileUploader implements FileUploader {
  async upload(file: Express.Multer.File): Promise<string> {
    return `https://example.com/uploads/${file.originalname}`;
  }

  async delete(fileUrl: string): Promise<void> {
    // Mock implementation - does nothing
  }
} 