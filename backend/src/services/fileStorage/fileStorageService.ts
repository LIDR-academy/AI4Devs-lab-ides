import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface FileInfo {
  originalName: string;
  mimetype: string;
  tempPath: string;
  candidateId: number;
}

class FileStorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(__dirname, '../../../uploads/resumes');
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    
    // Establecer permisos de lectura/escritura para el usuario y lectura para grupo y otros
    fs.chmodSync(this.baseDir, 0o755);
  }

  async saveFile(fileInfo: FileInfo): Promise<string> {
    try {
      const extension = path.extname(fileInfo.originalName);
      const hash = uuidv4().substring(0, 6);
      const newFileName = `cv_${fileInfo.candidateId}_${hash}${extension}`;
      const newPath = path.join(this.baseDir, newFileName);
      
      // Mover el archivo a su ubicación final
      fs.copyFileSync(fileInfo.tempPath, newPath);
      fs.unlinkSync(fileInfo.tempPath); // Eliminar el archivo temporal
      
      // Establecer permisos de lectura para todos
      fs.chmodSync(newPath, 0o644);
      
      return newFileName;
    } catch (error) {
      console.error('Error al guardar el archivo:', error);
      throw new Error('Error al guardar el archivo');
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.baseDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      throw new Error('Error al eliminar el archivo');
    }
  }

  getFileUrl(filename: string): string {
    // En un entorno de producción, esta sería una URL completa
    // Para desarrollo, devolvemos una ruta relativa
    return `/uploads/resumes/${filename}`;
  }
}

export default new FileStorageService(); 