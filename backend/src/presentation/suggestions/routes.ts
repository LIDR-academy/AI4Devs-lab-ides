import express from 'express';
import { SuggestionsController } from './suggestions.controller';

export function configureSuggestionsRoutes(
  app: express.Application,
  suggestionsController: SuggestionsController,
): void {
  const router = express.Router();

  // Get education suggestions
  router.get(
    '/education',
    suggestionsController.getEducationSuggestions.bind(suggestionsController),
  );

  // Get experience suggestions
  router.get(
    '/experience',
    suggestionsController.getExperienceSuggestions.bind(suggestionsController),
  );

  app.use('/api/suggestions', router);
}
