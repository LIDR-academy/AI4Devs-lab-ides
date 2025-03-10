import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando migración de la base de datos...');

  try {
    // 1. Leer el script SQL
    const sqlPath = path.join(__dirname, '../../prisma/migrations/manual_migration.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // 2. Dividir el script en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    // 3. Ejecutar cada comando
    for (const command of commands) {
      console.log(`Ejecutando: ${command.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(`${command};`);
    }
    
    console.log('Migración completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 