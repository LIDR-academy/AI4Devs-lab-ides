import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(__dirname, '../../uploads');

export const setupUploadsDirectory = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }

  // Asegurar permisos correctos (lectura/escritura para el usuario)
  try {
    fs.chmodSync(uploadsDir, 0o755);
    console.log('Set permissions for uploads directory');
  } catch (error) {
    console.error('Error setting permissions for uploads directory:', error);
  }
};

// Ejecutar setup cuando se importa el módulo
setupUploadsDirectory(); 