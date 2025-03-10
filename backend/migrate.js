const dotenv = require('dotenv');
const { exec } = require('child_process');

// Cargar variables de entorno
dotenv.config({ path: './backend/.env' });

// Ejecutar el comando de migración
exec('npx prisma migrate dev --name add_candidate_model --schema=prisma/schema.prisma', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
}); 