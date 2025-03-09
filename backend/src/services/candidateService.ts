import prisma from '../index';
import { Candidate, CandidateCreateInput } from '../types/candidate';
import { createError } from '../middlewares/errorHandler';

export const candidateService = {
  // Crear un nuevo candidato
  async createCandidate(data: CandidateCreateInput): Promise<Candidate> {
    try {
      // Verificar si ya existe un candidato con el mismo correo electrónico
      const existingCandidate = await prisma.$queryRaw`
        SELECT * FROM "Candidate" WHERE email = ${data.email} LIMIT 1
      `;
      
      if (Array.isArray(existingCandidate) && existingCandidate.length > 0) {
        throw createError('Ya existe un candidato con este correo electrónico', 400);
      }
      
      // Preparar los datos para guardar en la base de datos
      const candidateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        education: JSON.stringify(data.education),
        experience: JSON.stringify(data.experience),
        cvPath: data.cv ? data.cv.path : null
      };
      
      // Crear el candidato en la base de datos usando SQL directo para evitar problemas con Prisma
      await prisma.$executeRaw`
        INSERT INTO "Candidate" (
          "firstName", "lastName", "email", "phone", "address", 
          "education", "experience", "cvPath", "createdAt", "updatedAt"
        ) VALUES (
          ${candidateData.firstName}, 
          ${candidateData.lastName}, 
          ${candidateData.email}, 
          ${candidateData.phone}, 
          ${candidateData.address}, 
          ${candidateData.education}::jsonb, 
          ${candidateData.experience}::jsonb, 
          ${candidateData.cvPath}, 
          NOW(), 
          NOW()
        )
      `;
      
      // Obtener el candidato recién creado
      const newCandidate = await prisma.$queryRaw`
        SELECT * FROM "Candidate" WHERE email = ${data.email} LIMIT 1
      `;
      
      if (!Array.isArray(newCandidate) || newCandidate.length === 0) {
        throw createError('Error al crear el candidato', 500);
      }
      
      // Convertir los campos JSON de string a objeto
      const candidate = newCandidate[0] as any;
      
      // Asegurarse de que los campos JSON se parsean correctamente
      if (typeof candidate.education === 'string') {
        candidate.education = JSON.parse(candidate.education);
      }
      
      if (typeof candidate.experience === 'string') {
        candidate.experience = JSON.parse(candidate.experience);
      }
      
      return candidate as Candidate;
    } catch (error) {
      // Si es un error conocido, lo propagamos
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      
      // Si es un error de Prisma, lo manejamos
      console.error('Error al crear candidato:', error);
      throw createError('Error al crear el candidato', 500);
    }
  },
  
  // Obtener todos los candidatos
  async getCandidates(): Promise<Candidate[]> {
    try {
      const candidates = await prisma.$queryRaw`
        SELECT * FROM "Candidate" ORDER BY "createdAt" DESC
      `;
      
      if (!Array.isArray(candidates)) {
        return [];
      }
      
      // Convertir los campos JSON de string a objeto para cada candidato
      return candidates.map((candidate: any) => {
        if (typeof candidate.education === 'string') {
          candidate.education = JSON.parse(candidate.education);
        }
        
        if (typeof candidate.experience === 'string') {
          candidate.experience = JSON.parse(candidate.experience);
        }
        
        return candidate as Candidate;
      });
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
      throw createError('Error al obtener los candidatos', 500);
    }
  },
  
  // Obtener un candidato por ID
  async getCandidateById(id: number): Promise<Candidate> {
    try {
      const candidate = await prisma.$queryRaw`
        SELECT * FROM "Candidate" WHERE id = ${id} LIMIT 1
      `;
      
      if (!Array.isArray(candidate) || candidate.length === 0) {
        throw createError('Candidato no encontrado', 404);
      }
      
      // Convertir los campos JSON de string a objeto
      const candidateData = candidate[0] as any;
      
      if (typeof candidateData.education === 'string') {
        candidateData.education = JSON.parse(candidateData.education);
      }
      
      if (typeof candidateData.experience === 'string') {
        candidateData.experience = JSON.parse(candidateData.experience);
      }
      
      return candidateData as Candidate;
    } catch (error) {
      // Si es un error conocido, lo propagamos
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      
      console.error('Error al obtener candidato:', error);
      throw createError('Error al obtener el candidato', 500);
    }
  }
}; 