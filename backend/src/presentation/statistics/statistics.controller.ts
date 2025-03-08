import { PrismaClient } from '@prisma/client';
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

      // Get pending count
      const pending = await prisma.candidate.count({
        where: {
          status: 'PENDING',
        },
      });

      // Get valuated count
      const valuated = await prisma.candidate.count({
        where: {
          status: 'VALUATED',
        },
      });

      // Get discarded count
      const discarded = await prisma.candidate.count({
        where: {
          status: 'DISCARDED',
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
        valuated,
        discarded,
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
