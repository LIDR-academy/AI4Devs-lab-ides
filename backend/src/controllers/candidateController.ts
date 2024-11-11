import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const candidateController = {
  async getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = await prisma.candidate.findMany();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los candidatos' });
    }
  },

  async createCandidate(req: Request, res: Response) {
    try {
      const candidate = await prisma.candidate.create({
        data: {
          ...req.body,
          cvPath: req.file?.path
        }
      });
      res.status(201).json(candidate);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear el candidato' });
    }
  },

  async getCandidateById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const candidate = await prisma.candidate.findUnique({
        where: { id }
      });
      
      if (!candidate) {
        return res.status(404).json({
          error: 'Candidato no encontrado'
        });
      }
      
      res.json(candidate);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener el candidato'
      });
    }
  },

  async updateCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const candidate = await prisma.candidate.findUnique({
        where: { id }
      });
      
      if (!candidate) {
        return res.status(404).json({
          error: 'Candidato no encontrado'
        });
      }
      
      const updatedCandidate = await prisma.candidate.update({
        where: { id },
        data: {
          ...req.body,
          cvPath: req.file?.path
        }
      });
      
      res.json({
        message: 'Candidato actualizado exitosamente',
        data: updatedCandidate
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar el candidato',
        details: error.errors || error.message
      });
    }
  },

  async deleteCandidate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const candidate = await prisma.candidate.findUnique({
        where: { id }
      });
      
      if (!candidate) {
        return res.status(404).json({
          error: 'Candidato no encontrado'
        });
      }
      
      await prisma.candidate.delete({
        where: { id }
      });
      
      res.json({
        message: 'Candidato eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar el candidato'
      });
    }
  }
}; 