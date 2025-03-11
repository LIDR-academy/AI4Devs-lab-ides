import app from './app';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3010;

// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
    console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
  });
}

export default app;