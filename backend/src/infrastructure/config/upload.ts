import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const uploadDir = join(__dirname, '../../../uploads');
const cvDir = join(uploadDir, 'cvs');

// Asegurar que los directorios existan
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
if (!existsSync(cvDir)) {
  mkdirSync(cvDir);
}

export const uploadConfig = {
  directory: cvDir,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}; 