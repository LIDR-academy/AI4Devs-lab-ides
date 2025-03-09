import { Request, Response } from 'express';
import prisma from '../index';

/**
 * Get education suggestions based on existing data
 */
export const getEducationSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const searchTerm = typeof query === 'string' ? query.trim() : '';

    // Get unique education values from existing candidates
    const candidates = await prisma.candidate.findMany({
      where: {
        education: {
          not: null,
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        education: true,
      },
      distinct: ['education'],
      take: 10,
    });

    // Extract education values and filter out nulls
    const suggestions = candidates
      .map((candidate) => candidate.education)
      .filter(Boolean) as string[];

    // Add common education levels if query is empty or matches
    const commonEducationLevels = [
      'High School Diploma',
      "Associate's Degree",
      "Bachelor's Degree",
      "Master's Degree",
      'PhD',
      'MBA',
      'Vocational Training',
      'Certificate Program',
    ];

    const filteredCommonLevels = searchTerm
      ? commonEducationLevels.filter((level) =>
          level.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : commonEducationLevels;

    // Combine and deduplicate results
    const uniqueSuggestions = new Set([
      ...suggestions,
      ...filteredCommonLevels,
    ]);
    const allSuggestions = Array.from(uniqueSuggestions);

    res.json(allSuggestions);
  } catch (error) {
    console.error('Error fetching education suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch education suggestions' });
  }
};

/**
 * Get work experience suggestions based on existing data
 */
export const getExperienceSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const searchTerm = typeof query === 'string' ? query.trim() : '';

    // Get unique work experience values from existing candidates
    const candidates = await prisma.candidate.findMany({
      where: {
        workExperience: {
          not: null,
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      select: {
        workExperience: true,
      },
      distinct: ['workExperience'],
      take: 10,
    });

    // Extract work experience values and filter out nulls
    const suggestions = candidates
      .map((candidate) => candidate.workExperience)
      .filter(Boolean) as string[];

    // Add common job titles if query is empty or matches
    const commonJobTitles = [
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'Data Scientist',
      'Product Manager',
      'Project Manager',
      'UX Designer',
      'UI Designer',
      'QA Engineer',
      'Technical Writer',
    ];

    const filteredCommonTitles = searchTerm
      ? commonJobTitles.filter((title) =>
          title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : commonJobTitles;

    // Combine and deduplicate results
    const uniqueSuggestions = new Set([
      ...suggestions,
      ...filteredCommonTitles,
    ]);
    const allSuggestions = Array.from(uniqueSuggestions);

    res.json(allSuggestions);
  } catch (error) {
    console.error('Error fetching experience suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch experience suggestions' });
  }
};
