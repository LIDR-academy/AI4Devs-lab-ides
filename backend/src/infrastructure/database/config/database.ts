import { DataSource } from 'typeorm';
import { CandidateEntity } from '../entities/CandidateEntity';
import dotenv from 'dotenv';
import path from 'path';

// Determinar qué archivo .env cargar basado en NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(__dirname, '../../../../', envFile);

// Cargar variables de entorno
const result = dotenv.config({ path: envPath });

if (result.error) {
  throw new Error(`Error loading ${envFile}: ${result.error.message}`);
}


if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD || !process.env.DB_USER) {
  throw new Error('Missing required database configuration');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: process.env.NODE_ENV !== 'test',
  entities: [CandidateEntity],
  subscribers: [],
  migrations: [],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');
    }
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    console.error('Current configuration:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    throw error;
  }
};