import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'candidates_cv',
          resource_type: 'raw',
          type: 'private',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.public_id || '');
        }
      );

      const buffer = Buffer.from(file.buffer);
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}; 