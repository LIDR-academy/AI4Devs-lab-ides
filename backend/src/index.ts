import express from 'express';
import cors from 'cors';
import candidatesRouter from './routes/candidates';
import path from 'path';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add a simple logging middleware
app.use((req, res, next) => {
  next();
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Routes
app.use('/candidates', candidatesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start the server only when running this file directly (not in tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export for testing
export { app };
