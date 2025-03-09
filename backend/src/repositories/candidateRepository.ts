import prisma from '../config/database';
import { Candidate } from '@prisma/client';

// Interfaz para los datos de creación de candidato
export interface CreateCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cvUrl?: string;
  cvFileName?: string;
}

// Interfaz para los datos de actualización de candidato
export interface UpdateCandidateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
  cvUrl?: string;
  cvFileName?: string;
}

/**
 * Repositorio para operaciones CRUD de candidatos
 */
export class CandidateRepository {
  /**
   * Crear un nuevo candidato
   * @param data Datos del candidato
   * @returns El candidato creado
   */
  async create(data: CreateCandidateData): Promise<Candidate> {
    return prisma.candidate.create({
      data
    });
  }

  /**
   * Obtener todos los candidatos
   * @returns Lista de candidatos
   */
  async findAll(): Promise<Candidate[]> {
    return prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Obtener un candidato por ID
   * @param id ID del candidato
   * @returns El candidato encontrado o null
   */
  async findById(id: number): Promise<Candidate | null> {
    return prisma.candidate.findUnique({
      where: { id }
    });
  }

  /**
   * Obtener un candidato por email
   * @param email Email del candidato
   * @returns El candidato encontrado o null
   */
  async findByEmail(email: string): Promise<Candidate | null> {
    return prisma.candidate.findUnique({
      where: { email }
    });
  }

  /**
   * Actualizar un candidato
   * @param id ID del candidato
   * @param data Datos a actualizar
   * @returns El candidato actualizado
   */
  async update(id: number, data: UpdateCandidateData): Promise<Candidate> {
    return prisma.candidate.update({
      where: { id },
      data
    });
  }

  /**
   * Eliminar un candidato
   * @param id ID del candidato
   * @returns El candidato eliminado
   */
  async delete(id: number): Promise<Candidate> {
    return prisma.candidate.delete({
      where: { id }
    });
  }
} 