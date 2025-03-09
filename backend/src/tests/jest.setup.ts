import dotenv from 'dotenv';
import path from 'path';

// Cargar .env.test antes de que se ejecuten los tests
const envPath = path.resolve(__dirname, '../../.env.test');
console.log('Loading test environment from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env.test:', result.error);
  throw result.error;
}

console.log('Test environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
}); 