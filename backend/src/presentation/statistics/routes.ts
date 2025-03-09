import express from 'express';
import { StatisticsController } from './statistics.controller';

export function configureStatisticsRoutes(
  app: express.Application,
  statisticsController: StatisticsController,
): void {
  const router = express.Router();

  // Get statistics
  router.get(
    '/',
    statisticsController.getStatistics.bind(statisticsController),
  );

  app.use('/api/statistics', router);
}
