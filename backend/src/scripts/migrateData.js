const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Script para crear datos de ejemplo para educación y experiencia laboral
 */
async function createSampleData() {
  console.log('Iniciando creación de datos de ejemplo...');
  
  try {
    // Crear algunos candidatos de ejemplo si no hay ninguno
    const candidateCount = await prisma.candidate.count();
    
    if (candidateCount === 0) {
      console.log('No hay candidatos. Creando candidatos de ejemplo...');
      await createSampleCandidates();
    }
    
    // Obtener todos los candidatos
    const candidates = await prisma.candidate.findMany();
    
    console.log(`Encontrados ${candidates.length} candidatos para procesar.`);
    
    // Crear un log
    const logFile = path.join(__dirname, '../../logs/sample_data_log.txt');
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.writeFileSync(logFile, `Creación de datos de ejemplo iniciada: ${new Date().toISOString()}\n\n`);
    
    // Procesar cada candidato
    for (const candidate of candidates) {
      console.log(`Procesando candidato ID: ${candidate.id}, Nombre: ${candidate.firstName} ${candidate.lastName}`);
      fs.appendFileSync(logFile, `\nCandidato ID: ${candidate.id}, Nombre: ${candidate.firstName} ${candidate.lastName}\n`);
      
      // Crear datos de educación de ejemplo
      try {
        // Verificar si ya tiene registros de educación
        const existingEducation = await prisma.education.findMany({
          where: { candidateId: candidate.id }
        });
        
        if (existingEducation.length === 0) {
          // Crear datos de ejemplo
          const educationData = generateSampleEducation();
          for (const edu of educationData) {
            await prisma.education.create({
              data: {
                ...edu,
                candidateId: candidate.id
              }
            });
          }
          fs.appendFileSync(logFile, `  ✓ Educación creada: ${educationData.length} registros\n`);
        } else {
          fs.appendFileSync(logFile, `  ℹ Ya tiene ${existingEducation.length} registros de educación\n`);
        }
      } catch (error) {
        console.error(`Error al crear educación para candidato ${candidate.id}:`, error);
        fs.appendFileSync(logFile, `  ✗ Error al crear educación: ${error.message}\n`);
      }
      
      // Crear datos de experiencia laboral de ejemplo
      try {
        // Verificar si ya tiene registros de experiencia
        const existingExperience = await prisma.workExperience.findMany({
          where: { candidateId: candidate.id }
        });
        
        if (existingExperience.length === 0) {
          // Crear datos de ejemplo
          const experienceData = generateSampleWorkExperience();
          for (const exp of experienceData) {
            await prisma.workExperience.create({
              data: {
                ...exp,
                candidateId: candidate.id
              }
            });
          }
          fs.appendFileSync(logFile, `  ✓ Experiencia laboral creada: ${experienceData.length} registros\n`);
        } else {
          fs.appendFileSync(logFile, `  ℹ Ya tiene ${existingExperience.length} registros de experiencia laboral\n`);
        }
      } catch (error) {
        console.error(`Error al crear experiencia laboral para candidato ${candidate.id}:`, error);
        fs.appendFileSync(logFile, `  ✗ Error al crear experiencia laboral: ${error.message}\n`);
      }
      
      // Verificar si el candidato tiene teléfono
      if (!candidate.phone) {
        // Actualizar con un teléfono de ejemplo
        try {
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: { phone: generateSamplePhone() }
          });
          fs.appendFileSync(logFile, `  ✓ Teléfono actualizado\n`);
        } catch (error) {
          console.error(`Error al actualizar teléfono para candidato ${candidate.id}:`, error);
          fs.appendFileSync(logFile, `  ✗ Error al actualizar teléfono: ${error.message}\n`);
        }
      }
      
      // Verificar si el candidato tiene CV
      if (!candidate.cvUrl) {
        // Actualizar con un CV de ejemplo
        try {
          await prisma.candidate.update({
            where: { id: candidate.id },
            data: { 
              cvUrl: 'https://example.com/sample-cv.pdf',
              cvFileName: 'sample-cv.pdf'
            }
          });
          fs.appendFileSync(logFile, `  ✓ CV actualizado\n`);
        } catch (error) {
          console.error(`Error al actualizar CV para candidato ${candidate.id}:`, error);
          fs.appendFileSync(logFile, `  ✗ Error al actualizar CV: ${error.message}\n`);
        }
      }
    }
    
    console.log('Creación de datos de ejemplo completada.');
    fs.appendFileSync(logFile, `\nCreación de datos de ejemplo completada: ${new Date().toISOString()}\n`);
    
    // Generar informe simple
    const totalEducation = await prisma.education.count();
    const totalExperience = await prisma.workExperience.count();
    
    console.log(`Informe simple:`);
    console.log(`- Total de candidatos: ${candidates.length}`);
    console.log(`- Total de registros de educación: ${totalEducation}`);
    console.log(`- Total de registros de experiencia laboral: ${totalExperience}`);
    console.log(`- Promedio de educación por candidato: ${(totalEducation / candidates.length).toFixed(2)}`);
    console.log(`- Promedio de experiencia por candidato: ${(totalExperience / candidates.length).toFixed(2)}`);
    
  } catch (error) {
    console.error('Error durante la creación de datos de ejemplo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Crea candidatos de ejemplo
 */
async function createSampleCandidates() {
  const sampleCandidates = [
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34 612 345 678',
      address: 'Calle Mayor 123, Madrid',
      cvUrl: 'https://example.com/cv/juan-perez.pdf',
      cvFileName: 'juan-perez.pdf'
    },
    {
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@example.com',
      phone: '+34 623 456 789',
      address: 'Avenida Diagonal 456, Barcelona',
      cvUrl: 'https://example.com/cv/maria-garcia.pdf',
      cvFileName: 'maria-garcia.pdf'
    },
    {
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      email: 'carlos.rodriguez@example.com',
      phone: '+34 634 567 890',
      address: 'Calle Sierpes 789, Sevilla',
      cvUrl: 'https://example.com/cv/carlos-rodriguez.pdf',
      cvFileName: 'carlos-rodriguez.pdf'
    }
  ];
  
  for (const candidate of sampleCandidates) {
    await prisma.candidate.create({
      data: candidate
    });
  }
  
  console.log(`Creados ${sampleCandidates.length} candidatos de ejemplo.`);
}

/**
 * Genera datos de educación de ejemplo
 */
function generateSampleEducation() {
  const institutions = [
    'Universidad Complutense de Madrid',
    'Universidad Politécnica de Madrid',
    'Universidad Autónoma de Barcelona',
    'Universidad de Valencia',
    'Universidad de Sevilla'
  ];
  
  const degrees = [
    'Grado en Ingeniería Informática',
    'Máster en Ciencia de Datos',
    'Grado en Administración de Empresas',
    'Máster en Inteligencia Artificial',
    'Doctorado en Ciencias de la Computación'
  ];
  
  const fields = [
    'Informática',
    'Ciencia de Datos',
    'Administración',
    'Inteligencia Artificial',
    'Computación'
  ];
  
  // Generar entre 1 y 3 registros de educación
  const count = Math.floor(Math.random() * 3) + 1;
  const result = [];
  
  for (let i = 0; i < count; i++) {
    const startYear = 2000 + Math.floor(Math.random() * 15); // Entre 2000 y 2014
    const endYear = startYear + 4 + Math.floor(Math.random() * 3); // Entre 4 y 6 años después
    
    result.push({
      institution: institutions[Math.floor(Math.random() * institutions.length)],
      degree: degrees[Math.floor(Math.random() * degrees.length)],
      fieldOfStudy: fields[Math.floor(Math.random() * fields.length)],
      startDate: new Date(startYear, 8, 1), // 1 de septiembre
      endDate: new Date(endYear, 6, 31), // 31 de julio
      description: 'Descripción de los estudios realizados y logros académicos destacados.'
    });
  }
  
  return result;
}

/**
 * Genera datos de experiencia laboral de ejemplo
 */
function generateSampleWorkExperience() {
  const companies = [
    'Accenture',
    'Indra',
    'Telefónica',
    'BBVA',
    'Santander',
    'Repsol',
    'Iberdrola'
  ];
  
  const positions = [
    'Desarrollador Full Stack',
    'Ingeniero de Software',
    'Analista de Datos',
    'Arquitecto de Soluciones',
    'Consultor IT',
    'DevOps Engineer',
    'Project Manager'
  ];
  
  const locations = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Bilbao',
    'Remoto'
  ];
  
  // Generar entre 1 y 4 registros de experiencia
  const count = Math.floor(Math.random() * 4) + 1;
  const result = [];
  
  let currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const duration = Math.floor(Math.random() * 4) + 1; // Entre 1 y 4 años
    const startYear = currentYear - duration;
    
    result.push({
      company: companies[Math.floor(Math.random() * companies.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      startDate: new Date(startYear, Math.floor(Math.random() * 12), 1),
      endDate: i === 0 ? null : new Date(currentYear, Math.floor(Math.random() * 12), 28),
      description: 'Responsabilidades: Desarrollo de aplicaciones, mantenimiento de sistemas, implementación de nuevas funcionalidades. Logros: Mejora del rendimiento, reducción de costes, optimización de procesos.'
    });
    
    currentYear = startYear - 1; // Para la siguiente experiencia
  }
  
  return result;
}

/**
 * Genera un número de teléfono de ejemplo
 */
function generateSamplePhone() {
  return `+34 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`;
}

// Ejecutar la creación de datos de ejemplo
createSampleData()
  .then(() => console.log('Script finalizado'))
  .catch(e => console.error('Error en el script:', e));