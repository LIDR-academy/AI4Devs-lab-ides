import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para actualizar los tipos MIME de los CVs existentes
 * Por defecto, asumimos que todos son PDF ya que no teníamos esta información anteriormente
 */
async function updateMimeTypes() {
  try {
    console.log('Iniciando actualización de tipos MIME para CVs existentes...');
    
    // Obtener todos los candidatos
    const candidatos = await prisma.candidato.findMany({
      select: {
        id: true,
        mimeType: true
      }
    });
    
    console.log(`Encontrados ${candidatos.length} candidatos para actualizar.`);
    
    // Actualizar cada candidato si es necesario
    for (const candidato of candidatos) {
      // Si el tipo MIME ya está establecido (no es el valor por defecto), lo saltamos
      if (candidato.mimeType !== 'application/pdf') {
        console.log(`Candidato ${candidato.id} ya tiene un tipo MIME establecido: ${candidato.mimeType}`);
        continue;
      }
      
      // Actualizar a PDF por defecto (ya que no podemos saber el formato original)
      await prisma.candidato.update({
        where: { id: candidato.id },
        data: { mimeType: 'application/pdf' }
      });
      
      console.log(`Actualizado candidato ${candidato.id} con tipo MIME: application/pdf`);
    }
    
    console.log('Actualización de tipos MIME completada exitosamente.');
  } catch (error) {
    console.error('Error al actualizar tipos MIME:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
updateMimeTypes(); 