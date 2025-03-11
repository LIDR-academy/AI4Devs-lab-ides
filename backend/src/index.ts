import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Ruta al archivo de datos
const DATA_FILE = path.join(process.cwd(), 'data', 'candidates.json');

// Función auxiliar para leer datos
const readData = () => {
  try {
    // Si el archivo no existe, devolver datos vacíos
    if (!fs.existsSync(DATA_FILE)) {
      return { candidates: [] };
    }

    // Leer y parsear el archivo
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error al leer datos:', error);
    return { candidates: [] };
  }
};

// Función auxiliar para escribir datos
const writeData = (data) => {
  try {
    // Asegurar que el directorio existe
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir datos en formato JSON
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error al escribir datos:', error);
    return false;
  }
};

// Variable en memoria para optimizar rendimiento
let db = readData();

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

// Funciones existentes modificadas para usar archivo JSON

export const getCandidates = (options = {}) => {
  // Actualizar db desde archivo (por si otra instancia modificó los datos)
  db = readData();

  const { page = 1, limit = 10, search = '' } = options;

  // Aplicar filtro si hay un término de búsqueda
  let filteredCandidates = [...db.candidates];

  // Resto del código de filtrado y paginación sin cambios...
  // ...

  return {
    data: paginatedCandidates,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalItems,
      totalPages,
    },
  };
};

export const getCandidateById = (id) => {
  // Actualizar db desde archivo
  db = readData();

  const candidate = db.candidates.find((c) => c.id === id);
  return candidate || null;
};

export const addCandidate = (candidateData) => {
  // Actualizar db desde archivo
  db = readData();

  const newCandidate = {
    ...candidateData,
    id: candidateData.id || generateId(),
    createdAt: new Date().toISOString(),
  };

  // Añadir a memoria
  db.candidates.push(newCandidate);

  // Guardar en archivo
  writeData(db);

  return newCandidate;
};

export const updateCandidate = (id, candidateData) => {
  // Actualizar db desde archivo
  db = readData();

  const index = db.candidates.findIndex((c) => c.id === id);

  if (index === -1) return null;

  const updatedCandidate = {
    ...db.candidates[index],
    ...candidateData,
    id, // Mantener el mismo ID
    updatedAt: new Date().toISOString(),
  };

  // Actualizar en memoria
  db.candidates[index] = updatedCandidate;

  // Guardar en archivo
  writeData(db);

  return updatedCandidate;
};

export const deleteCandidate = (id) => {
  // Actualizar db desde archivo
  db = readData();

  const initialLength = db.candidates.length;
  db.candidates = db.candidates.filter((c) => c.id !== id);

  // Si se eliminó algún candidato, guardar cambios
  if (db.candidates.length < initialLength) {
    writeData(db);
    return true;
  }

  return false;
};

// Función para generar ID único (sin cambios)
const generateId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
