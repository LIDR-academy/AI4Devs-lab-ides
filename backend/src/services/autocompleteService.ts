import { PrismaClient, Institution, Company, Degree, JobPosition } from '@prisma/client';

/**
 * Servicio para la gestión de autocompletado
 */
export class AutocompleteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Buscar instituciones educativas
   * @param query Texto de búsqueda
   * @param limit Límite de resultados
   * @returns Lista de instituciones
   */
  async searchInstitutions(query: string, limit: number = 10): Promise<Institution[]> {
    return this.prisma.institution.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Buscar empresas
   * @param query Texto de búsqueda
   * @param limit Límite de resultados
   * @returns Lista de empresas
   */
  async searchCompanies(query: string, limit: number = 10): Promise<Company[]> {
    return this.prisma.company.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Buscar títulos académicos
   * @param query Texto de búsqueda
   * @param limit Límite de resultados
   * @returns Lista de títulos académicos
   */
  async searchDegrees(query: string, limit: number = 10): Promise<Degree[]> {
    return this.prisma.degree.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      take: limit,
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Buscar posiciones laborales
   * @param query Texto de búsqueda
   * @param limit Límite de resultados
   * @returns Lista de posiciones laborales
   */
  async searchPositions(query: string, limit: number = 10): Promise<JobPosition[]> {
    return this.prisma.jobPosition.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      take: limit,
      orderBy: {
        title: 'asc'
      }
    });
  }

  /**
   * Guardar una institución educativa
   * @param name Nombre de la institución
   * @returns La institución creada
   */
  async saveInstitution(name: string): Promise<Institution> {
    // Si el nombre es undefined o vacío, no hacemos nada
    if (!name || name.trim() === '') {
      return null as any;
    }
    
    // Verificar si ya existe
    const existing = await this.prisma.institution.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      return existing;
    }

    // Crear nueva institución
    return this.prisma.institution.create({
      data: { name }
    });
  }

  /**
   * Guardar una empresa
   * @param name Nombre de la empresa
   * @returns La empresa creada
   */
  async saveCompany(name: string): Promise<Company> {
    // Si el nombre es undefined o vacío, no hacemos nada
    if (!name || name.trim() === '') {
      return null as any;
    }
    
    // Verificar si ya existe
    const existing = await this.prisma.company.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      return existing;
    }

    // Crear nueva empresa
    return this.prisma.company.create({
      data: { name }
    });
  }

  /**
   * Guardar un título académico
   * @param name Nombre del título
   * @returns El título creado
   */
  async saveDegree(name: string): Promise<Degree> {
    // Si el nombre es undefined o vacío, no hacemos nada
    if (!name || name.trim() === '') {
      return null as any;
    }
    
    // Verificar si ya existe
    const existing = await this.prisma.degree.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      return existing;
    }

    // Crear nuevo título
    return this.prisma.degree.create({
      data: { name }
    });
  }

  /**
   * Guardar una posición laboral
   * @param title Título de la posición
   * @returns La posición creada
   */
  async savePosition(title: string): Promise<JobPosition> {
    // Si el título es undefined o vacío, no hacemos nada
    if (!title || title.trim() === '') {
      return null as any;
    }
    
    // Verificar si ya existe
    const existing = await this.prisma.jobPosition.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive'
        }
      }
    });

    if (existing) {
      return existing;
    }

    // Crear nueva posición
    return this.prisma.jobPosition.create({
      data: { title }
    });
  }

  /**
   * Guardar un campo de estudio
   * @param name Nombre del campo de estudio
   * @returns El campo de estudio creado
   */
  async saveFieldOfStudy(name: string): Promise<any> {
    // Si el nombre es undefined o vacío, no hacemos nada
    if (!name || name.trim() === '') {
      return null;
    }
    
    // Por ahora, simplemente devolvemos el nombre
    // Esto se implementará completamente cuando se genere la migración
    return { name };
  }
} 