import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidatoRoutes from './routes/candidatoRoutes';

dotenv.config();
const prisma = new PrismaClient();
export const app = express();
export default prisma;
const port = 3010;

// Use CORS with valid header values
app.use(cors({
  origin: 'http://localhost:3000', // specify the allowed origin or use a dynamic value
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON and URL-encoded body data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', candidatoRoutes);

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});