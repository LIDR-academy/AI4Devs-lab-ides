import { PrismaClient, Status } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class StatisticsController {
  /**
   * Get statistics about candidates
   */
  public async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      // Get total count
      const total = await prisma.candidate.count();

      // Get counts for each status
      const pending = await prisma.candidate.count({
        where: {
          status: Status.PENDING,
        },
      });

      const evaluated = await prisma.candidate.count({
        where: {
          status: Status.EVALUATED,
        },
      });

      const rejected = await prisma.candidate.count({
        where: {
          status: Status.REJECTED,
        },
      });

      const interview = await prisma.candidate.count({
        where: {
          status: Status.INTERVIEW,
        },
      });

      const offered = await prisma.candidate.count({
        where: {
          status: Status.OFFERED,
        },
      });

      const hired = await prisma.candidate.count({
        where: {
          status: Status.HIRED,
        },
      });

      // Get today count
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = await prisma.candidate.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      res.status(StatusCodes.OK).json({
        total,
        pending,
        evaluated,
        rejected,
        interview,
        offered,
        hired,
        todayCount,
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving statistics',
      });
    }
  }
}
