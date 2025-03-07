import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors'; // Importar cors
import path from 'path'; // Importar path
import userRoutes from './routes/userRoutes';

dotenv.config();
const prisma = new PrismaClient();

const app = express(); // Cambiar a export default
app.use(cors()); // Usar cors
app.use(express.json()); // Asegúrate de que esto esté antes de las rutas
app.use('/api', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Servir archivos estáticos

const port = 3010;

app.get('/', (req, res) => {
  res.send('Hello World!'); // Cambiar el mensaje de bienvenida
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app; // Exportar app
