import fs from 'fs';
import path from 'path';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import multer from 'multer';

/**
 * Servicio para la gestión de carga de archivos
 */
export class FileUploadService {
  private uploadDir: string;
  private allowedExtensions: string[];
  private maxFileSize: number;

  constructor() {
    // Directorio donde se guardarán los archivos
    this.uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
    
    // Extensiones permitidas
    this.allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    
    // Tamaño máximo del archivo en bytes (5MB por defecto)
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880');
    
    // Crear el directorio si no existe
    this.ensureUploadDirExists();
  }

  /**
   * Asegura que el directorio de carga exista
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      logger.info(`Directorio de carga creado: ${this.uploadDir}`);
    }
  }

  /**
   * Valida un archivo antes de cargarlo
   */
  private validateFile(file: multer.File): void {
    // Validar tamaño
    if (file.size > this.maxFileSize) {
      throw new ValidationError(`El archivo excede el tamaño máximo permitido de ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Validar extensión
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(fileExt)) {
      throw new ValidationError(`Tipo de archivo no permitido. Extensiones permitidas: ${this.allowedExtensions.join(', ')}`);
    }
  }

  /**
   * Genera un nombre de archivo único
   */
  private generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(originalFilename);
    const filename = `${timestamp}-${randomString}${ext}`;
    
    return filename;
  }

  /**
   * Carga un archivo en el servidor
   * @param file Archivo a cargar
   * @returns Información del archivo cargado
   */
  async uploadFile(file: multer.File): Promise<{ filename: string, path: string, url: string }> {
    try {
      // Validar el archivo
      this.validateFile(file);
      
      // Generar nombre único
      const filename = this.generateUniqueFilename(file.originalname);
      const filepath = path.join(this.uploadDir, filename);
      
      // Mover el archivo al directorio de carga (multer ya lo ha hecho)
      // Solo necesitamos renombrarlo si queremos usar nuestro propio nombre
      fs.renameSync(file.path, filepath);
      
      // Generar URL relativa
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const url = `${baseUrl}/uploads/${filename}`;
      
      logger.info(`Archivo cargado: ${filename}`);
      
      return {
        filename: file.originalname, // Nombre original
        path: filepath,              // Ruta completa en el servidor
        url                          // URL para acceder al archivo
      };
    } catch (error) {
      logger.error(`Error al cargar archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }

  /**
   * Elimina un archivo del servidor
   * @param filename Nombre del archivo a eliminar
   */
  async deleteFile(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, filename);
      
      // Verificar si el archivo existe
      if (fs.existsSync(filepath)) {
        // Eliminar el archivo
        fs.unlinkSync(filepath);
        logger.info(`Archivo eliminado: ${filename}`);
      } else {
        logger.warn(`Archivo no encontrado para eliminar: ${filename}`);
      }
    } catch (error) {
      logger.error(`Error al eliminar archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      throw error;
    }
  }
} 