import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { Server } from './infrastructure/config/Server';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;
const server = new Server(port);
server.start();

// Configuración de Multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${fileExtension}`);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Permitir solo ciertos tipos de archivo
  const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
  }
};

// Configuración de Multer con límites
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Extender el tipo Request para incluir la propiedad 'file' y 'user'
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      user?: any;
    }
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000', // Permite el acceso desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true, // Permite el envío de cookies
}));

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Clave secreta para firmar los tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware para verificar el token JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }
  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware para manejar errores de Multer
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    // Otro tipo de error
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Ruta para registrar un nuevo usuario
app.post('/register', [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    console.log('User registered successfully:', user);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error registering user:', error);
    if (error.code === 'P2002') { // Prisma unique constraint failed
      res.status(409).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user' });
    }
  }
});

// Ruta para iniciar sesión
app.post('/login', [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    console.log('Login request body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    console.log('Login attempt for email:', email);
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error: any) {
    console.error('Error during login:', error);
    
    // Verificar si es un error de conexión a la base de datos
    if (error.message && error.message.includes("Can't reach database server")) {
      return res.status(503).json({ 
        message: 'Database connection error', 
        details: 'The database server is not running. Please start the database server and try again.' 
      });
    }
    
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Ruta para añadir un candidato
app.post('/candidates', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
  upload.single('cv')(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('education').notEmpty().withMessage('Education is required'),
  body('experience').notEmpty().withMessage('Experience is required')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, phone, address, education, experience } = req.body;
  const cvFilePath = req.file ? req.file.filename : '';

  try {
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        experience,
        cvFilePath: cvFilePath // Guardar solo el nombre del archivo
      }
    });
    res.status(201).json({
      ...candidate,
      cvUrl: cvFilePath ? `/cv/${cvFilePath}` : null // Incluir URL para descargar el CV
    });
  } catch (error: any) {
    console.error('Error adding candidate:', error);
    
    // Verificar si es un error de conexión a la base de datos
    if (error.message && error.message.includes("Can't reach database server")) {
      return res.status(503).json({ 
        message: 'Database connection error', 
        details: 'The database server is not running. Please start the database server and try again.' 
      });
    }
    
    // Verificar si es un error de restricción única
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A candidate with this email already exists.' });
    }
    
    res.status(500).json({ message: 'Error adding candidate', error: error.message });
  }
});

// Ruta para obtener todos los candidatos
app.get('/candidates', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.json(candidates);
  } catch (error: any) {
    console.error('Error fetching candidates:', error);
    
    // Verificar si es un error de conexión a la base de datos
    if (error.message && error.message.includes("Can't reach database server")) {
      return res.status(503).json({ 
        message: 'Database connection error', 
        details: 'The database server is not running. Please start the database server and try again.' 
      });
    }
    
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
});

// Ruta para descargar un currículum
app.get('/cv/:filename', authenticateJWT, (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  console.log('Requested file:', filename);
  console.log('File path:', filePath);
  
  // Verificar si el archivo existe
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});
