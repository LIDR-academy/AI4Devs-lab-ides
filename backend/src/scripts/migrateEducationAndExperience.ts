import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Definir una interfaz para el candidato con los campos antiguos
interface CandidateWithLegacyFields {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education?: string | null;
  workExperience?: string | null;
  cvUrl: string | null;
  cvFileName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Script para migrar datos de educación y experiencia laboral
 * desde campos de texto a modelos estructurados
 */
async function migrateData() {
  console.log('Iniciando migración de datos...');
  
  try {
    // Obtener todos los candidatos con una consulta SQL directa para incluir los campos antiguos
    const candidates = await prisma.$queryRaw<CandidateWithLegacyFields[]>`
      SELECT id, "firstName", "lastName", email, phone, address, education, "workExperience", "cvUrl", "cvFileName", "createdAt", "updatedAt"
      FROM "Candidate"
    `;
    
    console.log(`Encontrados ${candidates.length} candidatos para migrar.`);
    
    // Crear un log de la migración
    const logFile = path.join(__dirname, '../../logs/migration_log.txt');
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.writeFileSync(logFile, `Migración iniciada: ${new Date().toISOString()}\n\n`);
    
    // Procesar cada candidato
    for (const candidate of candidates) {
      console.log(`Procesando candidato ID: ${candidate.id}, Nombre: ${candidate.firstName} ${candidate.lastName}`);
      fs.appendFileSync(logFile, `\nCandidato ID: ${candidate.id}, Nombre: ${candidate.firstName} ${candidate.lastName}\n`);
      
      // Migrar datos de educación
      if (candidate.education) {
        try {
          const educationData = parseEducation(candidate.education);
          for (const edu of educationData) {
            await prisma.education.create({
              data: {
                ...edu,
                candidateId: candidate.id
              }
            });
          }
          fs.appendFileSync(logFile, `  ✓ Educación migrada: ${educationData.length} registros\n`);
        } catch (error: any) {
          console.error(`Error al migrar educación para candidato ${candidate.id}:`, error);
          fs.appendFileSync(logFile, `  ✗ Error al migrar educación: ${error.message}\n`);
        }
      } else {
        fs.appendFileSync(logFile, `  ⚠ Sin datos de educación para migrar\n`);
      }
      
      // Migrar datos de experiencia laboral
      if (candidate.workExperience) {
        try {
          const experienceData = parseWorkExperience(candidate.workExperience);
          for (const exp of experienceData) {
            await prisma.workExperience.create({
              data: {
                ...exp,
                candidateId: candidate.id
              }
            });
          }
          fs.appendFileSync(logFile, `  ✓ Experiencia laboral migrada: ${experienceData.length} registros\n`);
        } catch (error: any) {
          console.error(`Error al migrar experiencia laboral para candidato ${candidate.id}:`, error);
          fs.appendFileSync(logFile, `  ✗ Error al migrar experiencia laboral: ${error.message}\n`);
        }
      } else {
        fs.appendFileSync(logFile, `  ⚠ Sin datos de experiencia laboral para migrar\n`);
      }
      
      // Verificar si el candidato tiene teléfono
      if (!candidate.phone) {
        fs.appendFileSync(logFile, `  ⚠ Candidato sin número de teléfono\n`);
      }
      
      // Verificar si el candidato tiene CV
      if (!candidate.cvUrl) {
        fs.appendFileSync(logFile, `  ⚠ Candidato sin CV\n`);
      }
    }
    
    console.log('Migración completada.');
    fs.appendFileSync(logFile, `\nMigración completada: ${new Date().toISOString()}\n`);
    
    // Generar informe de candidatos incompletos
    const incompleteReport = await generateIncompleteReport();
    console.log(`Informe de candidatos incompletos generado: ${incompleteReport}`);
    
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Parsea el texto de educación en objetos estructurados
 */
function parseEducation(educationText: string): Array<{
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}> {
  // Implementación básica para extraer información de texto
  // En un caso real, esto sería más sofisticado con NLP o reglas más complejas
  
  const result = [];
  
  // Dividir por líneas o párrafos
  const entries = educationText.split(/\n{2,}|\r\n{2,}|\.(?=\s[A-Z])/);
  
  for (const entry of entries) {
    if (!entry.trim()) continue;
    
    // Extraer información básica usando expresiones regulares
    const institutionMatch = entry.match(/([A-Za-z\s]+University|College|Institute|School)/i);
    const degreeMatch = entry.match(/(Bachelor|Master|PhD|Doctorate|Degree|Diploma)/i);
    const yearMatch = entry.match(/(\d{4})\s*-\s*(\d{4}|Present|Actual|Current)/i);
    
    if (institutionMatch || degreeMatch) {
      const institution = institutionMatch ? institutionMatch[0].trim() : 'Institución no especificada';
      const degree = degreeMatch ? degreeMatch[0].trim() : 'Título no especificado';
      const fieldOfStudy = 'Campo no especificado'; // Esto requeriría un análisis más sofisticado
      
      // Fechas
      let startDate = new Date();
      let endDate: Date | undefined = undefined;
      
      if (yearMatch) {
        const startYear = parseInt(yearMatch[1]);
        startDate = new Date(startYear, 0, 1);
        
        if (yearMatch[2].match(/^\d{4}$/)) {
          const endYear = parseInt(yearMatch[2]);
          endDate = new Date(endYear, 11, 31);
        }
      }
      
      result.push({
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        description: entry.trim()
      });
    }
  }
  
  // Si no se pudo extraer información estructurada, crear un registro genérico
  if (result.length === 0 && educationText.trim()) {
    result.push({
      institution: 'Extraído de texto',
      degree: 'Extraído de texto',
      fieldOfStudy: 'Extraído de texto',
      startDate: new Date(2000, 0, 1), // Fecha genérica
      description: educationText.trim()
    });
  }
  
  return result;
}

/**
 * Parsea el texto de experiencia laboral en objetos estructurados
 */
function parseWorkExperience(experienceText: string): Array<{
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}> {
  // Implementación básica para extraer información de texto
  // En un caso real, esto sería más sofisticado con NLP o reglas más complejas
  
  const result = [];
  
  // Dividir por líneas o párrafos
  const entries = experienceText.split(/\n{2,}|\r\n{2,}|\.(?=\s[A-Z])/);
  
  for (const entry of entries) {
    if (!entry.trim()) continue;
    
    // Extraer información básica usando expresiones regulares
    const companyMatch = entry.match(/([A-Za-z\s]+Company|Corp|Inc|LLC|Ltd)/i);
    const positionMatch = entry.match(/(Developer|Engineer|Manager|Director|Analyst|Designer)/i);
    const yearMatch = entry.match(/(\d{4})\s*-\s*(\d{4}|Present|Actual|Current)/i);
    
    if (companyMatch || positionMatch) {
      const company = companyMatch ? companyMatch[0].trim() : 'Empresa no especificada';
      const position = positionMatch ? positionMatch[0].trim() : 'Posición no especificada';
      
      // Fechas
      let startDate = new Date();
      let endDate: Date | undefined = undefined;
      
      if (yearMatch) {
        const startYear = parseInt(yearMatch[1]);
        startDate = new Date(startYear, 0, 1);
        
        if (yearMatch[2].match(/^\d{4}$/)) {
          const endYear = parseInt(yearMatch[2]);
          endDate = new Date(endYear, 11, 31);
        }
      }
      
      result.push({
        company,
        position,
        startDate,
        endDate,
        description: entry.trim()
      });
    }
  }
  
  // Si no se pudo extraer información estructurada, crear un registro genérico
  if (result.length === 0 && experienceText.trim()) {
    result.push({
      company: 'Extraído de texto',
      position: 'Extraído de texto',
      startDate: new Date(2010, 0, 1), // Fecha genérica
      description: experienceText.trim()
    });
  }
  
  return result;
}

/**
 * Genera un informe de candidatos incompletos
 */
async function generateIncompleteReport(): Promise<string> {
  const incompleteFile = path.join(__dirname, '../../logs/incomplete_candidates.txt');
  
  // Usar consultas SQL directas para evitar problemas con los tipos de Prisma
  const noPhone = await prisma.$queryRaw<Array<{id: number, firstName: string, lastName: string, email: string}>>`
    SELECT id, "firstName", "lastName", email
    FROM "Candidate"
    WHERE phone IS NULL OR phone = ''
  `;
  
  const noCV = await prisma.$queryRaw<Array<{id: number, firstName: string, lastName: string, email: string}>>`
    SELECT id, "firstName", "lastName", email
    FROM "Candidate"
    WHERE "cvUrl" IS NULL OR "cvUrl" = ''
  `;
  
  const noEducation = await prisma.$queryRaw<Array<{id: number, firstName: string, lastName: string, email: string}>>`
    SELECT c.id, c."firstName", c."lastName", c.email
    FROM "Candidate" c
    LEFT JOIN "Education" e ON c.id = e."candidateId"
    WHERE e.id IS NULL
  `;
  
  const noExperience = await prisma.$queryRaw<Array<{id: number, firstName: string, lastName: string, email: string}>>`
    SELECT c.id, c."firstName", c."lastName", c.email
    FROM "Candidate" c
    LEFT JOIN "WorkExperience" w ON c.id = w."candidateId"
    WHERE w.id IS NULL
  `;
  
  // Escribir el informe
  fs.writeFileSync(incompleteFile, `Informe de Candidatos Incompletos - ${new Date().toISOString()}\n\n`);
  
  fs.appendFileSync(incompleteFile, `Candidatos sin número de teléfono (${noPhone.length}):\n`);
  noPhone.forEach(c => {
    fs.appendFileSync(incompleteFile, `  - ID: ${c.id}, Nombre: ${c.firstName} ${c.lastName}, Email: ${c.email}\n`);
  });
  
  fs.appendFileSync(incompleteFile, `\nCandidatos sin CV (${noCV.length}):\n`);
  noCV.forEach(c => {
    fs.appendFileSync(incompleteFile, `  - ID: ${c.id}, Nombre: ${c.firstName} ${c.lastName}, Email: ${c.email}\n`);
  });
  
  fs.appendFileSync(incompleteFile, `\nCandidatos sin educación (${noEducation.length}):\n`);
  noEducation.forEach(c => {
    fs.appendFileSync(incompleteFile, `  - ID: ${c.id}, Nombre: ${c.firstName} ${c.lastName}, Email: ${c.email}\n`);
  });
  
  fs.appendFileSync(incompleteFile, `\nCandidatos sin experiencia laboral (${noExperience.length}):\n`);
  noExperience.forEach(c => {
    fs.appendFileSync(incompleteFile, `  - ID: ${c.id}, Nombre: ${c.firstName} ${c.lastName}, Email: ${c.email}\n`);
  });
  
  return incompleteFile;
}

// Ejecutar la migración
migrateData()
  .then(() => console.log('Script finalizado'))
  .catch(e => console.error('Error en el script:', e)); 