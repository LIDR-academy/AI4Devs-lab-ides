// Script para actualizar los tipos MIME de los CV existentes
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMimeTypes() {
  try {
    console.log('Iniciando actualización de tipos MIME para CVs existentes...');
    
    const candidatos = await prisma.candidato.findMany({
      select: {
        id: true,
        mimeType: true
      }
    });
    
    console.log(`Encontrados ${candidatos.length} candidatos para actualizar.`);
    
    for (const candidato of candidatos) {
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

updateMimeTypes(); 