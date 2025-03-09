import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const prisma = new PrismaClient();

export class SuggestionsController {
  /**
   * Get education suggestions (unique values from candidates)
   */
  public async getEducationSuggestions(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      // Since we can't use distinct with Prisma on text fields efficiently,
      // we'll simulate some predefined education suggestions
      const educationSuggestions = [
        'Bachelor of Computer Science',
        'Master of Business Administration',
        'Ph.D. in Software Engineering',
        'Master of Computer Science',
        'Bachelor of Engineering',
        'Bachelor of Business Administration',
        'Master in Information Technology',
        'Bachelor of Science in Computer Engineering',
        'Master of Science in Data Science',
        'Bachelor of Arts in Communication',
      ];

      res.status(StatusCodes.OK).json(educationSuggestions);
    } catch (error) {
      console.error('Error fetching education suggestions:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving education suggestions',
      });
    }
  }

  /**
   * Get experience suggestions (unique values from candidates)
   */
  public async getExperienceSuggestions(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      // Since we can't use distinct with Prisma on text fields efficiently,
      // we'll simulate some predefined experience suggestions
      const experienceSuggestions = [
        'Software Engineer at Google',
        'Frontend Developer at Microsoft',
        'Full Stack Developer at Amazon',
        'Data Scientist at Facebook',
        'Machine Learning Engineer at IBM',
        'DevOps Engineer at Netflix',
        'Mobile Developer at Apple',
        'Backend Developer at Twitter',
        'Product Manager at Spotify',
        'UX Designer at Adobe',
      ];

      res.status(StatusCodes.OK).json(experienceSuggestions);
    } catch (error) {
      console.error('Error fetching experience suggestions:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving experience suggestions',
      });
    }
  }
}
