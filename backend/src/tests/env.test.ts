import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

describe('Environment Variables', () => {
  it('should load .env.test file correctly', () => {
    const envPath = path.resolve(__dirname, '../../.env.test');
    
    // Verificar que el archivo existe
    console.log('Checking if file exists at:', envPath);
    const fileExists = fs.existsSync(envPath);
    expect(fileExists).toBe(true);

    // Leer el contenido del archivo
    console.log('Reading file contents:');
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log(envContent);

    // Intentar cargar las variables
    const result = dotenv.config({ path: envPath });
    console.log('Dotenv result:', result);

    // Verificar las variables cargadas
    console.log('Environment variables after loading:', {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      NODE_ENV: process.env.NODE_ENV
    });

    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_USER).toBeDefined();
    expect(process.env.DB_PASSWORD).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
  });
}); 