declare module 'multer' {
  import { Request } from 'express';
  
  namespace multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
    
    interface FileFilterCallback {
      (error: Error | null, acceptFile: boolean): void;
    }
    
    interface MulterError extends Error {
      code: string;
      field?: string;
      storageErrors?: Error[];
    }
  }
  
  interface Multer {
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: Array<{ name: string; maxCount?: number }>): any;
    none(): any;
  }
  
  interface DiskStorageOptions {
    destination?: string | ((req: Request, file: multer.File, callback: (error: Error | null, destination: string) => void) => void);
    filename?: (req: Request, file: multer.File, callback: (error: Error | null, filename: string) => void) => void;
  }
  
  interface StorageEngine {
    _handleFile(req: Request, file: multer.File, callback: (error?: Error, info?: Partial<multer.File>) => void): void;
    _removeFile(req: Request, file: multer.File, callback: (error: Error) => void): void;
  }
  
  interface Options {
    storage?: StorageEngine;
    fileFilter?: (req: Request, file: multer.File, callback: multer.FileFilterCallback) => void;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      parts?: number;
      headerPairs?: number;
    };
  }
  
  function diskStorage(options: DiskStorageOptions): StorageEngine;
  
  function multer(options?: Options): Multer;
  
  export = multer;
} 