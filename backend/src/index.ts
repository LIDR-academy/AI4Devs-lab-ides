import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';
import path from 'path';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Candidate routes
app.use('/api/candidates', candidateRoutes);

// Add this route to your index.ts file
app.get('/api/test-db', async (req, res) => {
  try {
    // Try to connect to the database
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log('Database query result:', result);
    
    res.json({
      message: 'Database connection successful',
      result
    });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      message: 'Database connection test failed',
      error: error.message || String(error)
    });
  }
});

// Test database connection
async function testConnection() {
  try {
    // Try to query the database
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Call the function when the server starts
testConnection()
  .then(connected => {
    if (connected) {
      console.log('Database is properly configured');
    } else {
      console.error('Please check your database configuration');
    }
  });

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
