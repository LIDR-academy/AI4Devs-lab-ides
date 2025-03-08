import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { FileService } from '../infrastructure/file.service';

// Mock delle funzioni di fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  unlink: jest.fn(), // Mock di fs.unlink
  promises: {
    unlink: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock di path
jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
  extname: jest.fn().mockImplementation((filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  }),
}));

// Mock di crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('mocked-random-string'),
  }),
}));

// Mock di util.promisify
jest.mock('util', () => ({
  promisify: jest.fn().mockImplementation(() => {
    return jest.fn().mockResolvedValue(undefined);
  }),
}));

// Non è necessario mockare util.promisify perché sovrascriveremo direttamente unlinkAsync

describe('FileService', () => {
  let fileService: FileService;
  const mockUploadDir = 'backend/uploads';
  const originalDateNow = Date.now;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now per avere valori prevedibili
    jest.spyOn(Date, 'now').mockImplementation(() => 1234567890);
    // Configura i valori di ritorno delle funzioni mock
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    fileService = new FileService();
  });

  afterEach(() => {
    // Ripristina Date.now
    Date.now = originalDateNow;
  });

  describe('constructor', () => {
    it('should create upload directory if it does not exist', () => {
      // Simula che la directory non esista
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

      // Re-crea il servizio per triggerare il constructor
      fileService = new FileService();

      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('uploads'),
      );
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('uploads'),
        { recursive: true },
      );
    });

    it('should not create upload directory if it already exists', () => {
      // Simula che la directory esista già
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      // Re-crea il servizio per triggerare il constructor
      fileService = new FileService();

      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('uploads'),
      );
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('generateSecureFilename', () => {
    it('should generate a secure filename with timestamp and random string', () => {
      const originalFilename = 'test-file.pdf';
      (path.extname as jest.Mock).mockReturnValueOnce('.pdf');

      const result = fileService.generateSecureFilename(originalFilename);

      expect(result).toBe('1234567890-mocked-random-string.pdf');
      expect(crypto.randomBytes).toHaveBeenCalledWith(16);
      expect(path.extname).toHaveBeenCalledWith(originalFilename);
    });
  });

  describe('validateFileType', () => {
    it('should return true for PDF files', () => {
      const result = fileService.validateFileType('application/pdf');
      expect(result).toBe(true);
    });

    it('should return true for DOCX files', () => {
      const result = fileService.validateFileType(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      expect(result).toBe(true);
    });

    it('should return false for other file types', () => {
      const result = fileService.validateFileType('image/jpeg');
      expect(result).toBe(false);
    });
  });

  describe('saveFile', () => {
    it('should save the file and return the secure filename', async () => {
      const mockFile = {
        originalname: 'test-file.pdf',
        mimetype: 'application/pdf',
        path: '/tmp/upload_12345',
      } as Express.Multer.File;

      // Mock del metodo generateSecureFilename
      jest
        .spyOn(fileService, 'generateSecureFilename')
        .mockReturnValue('secure-filename.pdf');

      const result = await fileService.saveFile(mockFile);

      expect(result).toBe('secure-filename.pdf');
      expect(fs.copyFileSync).toHaveBeenCalledWith(
        mockFile.path,
        expect.stringContaining('secure-filename.pdf'),
      );
    });

    it('should throw an error for invalid file types', async () => {
      const mockFile = {
        originalname: 'test-file.jpg',
        mimetype: 'image/jpeg',
        path: '/tmp/upload_12345',
      } as Express.Multer.File;

      await expect(fileService.saveFile(mockFile)).rejects.toThrow(
        'Invalid file type',
      );
      expect(fs.copyFileSync).not.toHaveBeenCalled();
    });

    it('should not try to delete temp file if it does not exist', async () => {
      const mockFile = {
        originalname: 'test-file.pdf',
        mimetype: 'application/pdf',
        path: '/tmp/upload_12345',
      } as Express.Multer.File;

      // Simula che il file non esista alla chiamata di existsSync durante la cancellazione
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      // Mock del metodo generateSecureFilename
      jest
        .spyOn(fileService, 'generateSecureFilename')
        .mockReturnValue('secure-filename.pdf');

      const result = await fileService.saveFile(mockFile);

      expect(result).toBe('secure-filename.pdf');
      // Verifichiamo che fs.promises.unlink non sia stato chiamato
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
  });

  describe('getFilePath', () => {
    it('should return the full path to the file', () => {
      const filename = 'test-file.pdf';
      (path.join as jest.Mock).mockReturnValueOnce(`uploads/${filename}`);

      const result = fileService.getFilePath(filename);

      expect(result).toBe(`uploads/${filename}`);
      expect(path.join).toHaveBeenCalledWith(expect.any(String), filename);
    });
  });
});
