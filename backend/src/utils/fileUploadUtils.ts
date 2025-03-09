import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AppError } from './AppError';

// Directorio base para almacenar archivos
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Asegurarse de que el directorio de carga existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Tipos de archivos permitidos
 */
export const ALLOWED_FILE_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'text/plain': 'txt',
};

/**
 * Tamaño máximo de archivo en bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Verifica si un tipo de archivo es permitido
 * @param mimeType Tipo MIME del archivo
 * @returns Booleano indicando si el tipo es permitido
 */
export const isAllowedFileType = (mimeType: string): boolean => {
  return Object.keys(ALLOWED_FILE_TYPES).includes(mimeType);
};

/**
 * Obtiene la extensión de un tipo MIME
 * @param mimeType Tipo MIME del archivo
 * @returns Extensión del archivo
 */
export const getFileExtension = (mimeType: string): string => {
  return mimeType in ALLOWED_FILE_TYPES 
    ? ALLOWED_FILE_TYPES[mimeType as keyof typeof ALLOWED_FILE_TYPES] 
    : '';
};

/**
 * Genera un nombre de archivo único
 * @param originalName Nombre original del archivo
 * @param extension Extensión del archivo
 * @returns Nombre de archivo único
 */
export const generateUniqueFileName = (originalName: string, extension: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50);
  
  return `${sanitizedName}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Guarda un archivo en el sistema de archivos
 * @param fileBuffer Buffer del archivo
 * @param fileName Nombre del archivo
 * @returns Ruta del archivo guardado
 */
export const saveFile = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.promises.writeFile(filePath, fileBuffer);
    return filePath;
  } catch (error) {
    console.error('Error al guardar el archivo:', error);
    throw new AppError('Error al guardar el archivo', 500, 'FILE_UPLOAD_ERROR');
  }
};

/**
 * Elimina un archivo del sistema de archivos
 * @param filePath Ruta del archivo a eliminar
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
    throw new AppError('Error al eliminar el archivo', 500, 'FILE_DELETE_ERROR');
  }
};

/**
 * Encripta un archivo
 * @param fileBuffer Buffer del archivo
 * @param key Clave de encriptación
 * @returns Buffer del archivo encriptado
 */
export const encryptFile = (fileBuffer: Buffer, key: Buffer): Buffer => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  const encryptedBuffer = Buffer.concat([
    iv,
    cipher.update(fileBuffer),
    cipher.final(),
  ]);
  
  return encryptedBuffer;
};

/**
 * Desencripta un archivo
 * @param encryptedBuffer Buffer del archivo encriptado
 * @param key Clave de encriptación
 * @returns Buffer del archivo desencriptado
 */
export const decryptFile = (encryptedBuffer: Buffer, key: Buffer): Buffer => {
  const iv = encryptedBuffer.slice(0, 16);
  const encryptedData = encryptedBuffer.slice(16);
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  const decryptedBuffer = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  
  return decryptedBuffer;
};

/**
 * Genera una clave de encriptación
 * @returns Clave de encriptación
 */
export const generateEncryptionKey = (): Buffer => {
  return crypto.randomBytes(32);
}; 