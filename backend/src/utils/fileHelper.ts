import fs from 'fs';
import path from 'path';

export const getRelativeFilePath = (absolutePath: string): string => {
  const base = path.join(__dirname, '../../uploads');
  return absolutePath.replace(base, '');
};

export const deleteFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
