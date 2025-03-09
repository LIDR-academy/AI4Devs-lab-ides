import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { formatResponse, formatError } from '../utils/response.utils';
import { translate } from '../utils/i18n.utils';

/**
 * Create a new candidate
 * @route POST /api/candidates
 */
export const createCandidate = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      linkedinProfile,
      desiredSalary,
      isLinkedinCv,
      education,
      workExperience,
      skills,
      languages
    } = req.body;

    // Check if candidate with email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      return res
        .status(409)
        .json(formatError(translate('common.errors.emailExists', req.language)));
    }

    // Create candidate with related data
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        linkedinProfile,
        desiredSalary,
        isLinkedinCv: isLinkedinCv || false,
        // Add education if provided
        ...(education && education.length > 0
          ? {
              education: {
                create: education.map(
                  (edu: {
                    institution: string;
                    degree: string;
                    startDate: string;
                    endDate?: string;
                    summary?: string;
                  }) => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    startDate: new Date(edu.startDate),
                    endDate: edu.endDate ? new Date(edu.endDate) : null,
                    summary: edu.summary || null,
                  })
                ),
              },
            }
          : {}),
        // Add workExperience if provided
        ...(workExperience && workExperience.length > 0
          ? {
              workExperience: {
                create: workExperience.map(
                  (exp: {
                    company: string;
                    position: string;
                    startDate: string;
                    endDate?: string;
                    summary?: string;
                  }) => ({
                    company: exp.company,
                    position: exp.position,
                    startDate: new Date(exp.startDate),
                    endDate: exp.endDate ? new Date(exp.endDate) : null,
                    summary: exp.summary || null,
                  })
                ),
              },
            }
          : {}),
        // Add skills if provided
        ...(skills && skills.length > 0
          ? {
              skills: {
                create: skills.map((skill: string) => ({
                  name: skill,
                })),
              },
            }
          : {}),
        // Add languages if provided
        ...(languages && languages.length > 0
          ? {
              languages: {
                create: languages.map(
                  (lang: { name: string; level: string }) => ({
                    name: lang.name,
                    level: lang.level,
                  })
                ),
              },
            }
          : {}),
      },
      include: {
        education: true,
        workExperience: true,
        skills: true,
        languages: true,
        documents: true,
      },
    });

    return res.status(201).json(formatResponse(candidate, translate('common.success.candidateCreated', req.language)));
  } catch (error: any) {
    console.error('Error creating candidate:', error);
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json(formatError(translate('common.errors.emailExists', req.language)));
    }
    return res.status(500).json(formatError(translate('common.errors.failedToCreate', req.language)));
  }
};

/**
 * Get all candidates
 * @route GET /api/candidates
 */
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        education: true,
        workExperience: true,
        skills: true,
        languages: true,
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            uploadedAt: true,
          },
        },
      },
    });
    return res.status(200).json(formatResponse(candidates, translate('common.success.operationSuccessful', req.language)));
  } catch (error) {
    console.error('Error getting candidates:', error);
    return res.status(500).json(formatError(translate('common.errors.somethingWentWrong', req.language)));
  }
};

/**
 * Get a candidate by id
 * @route GET /api/candidates/:id
 */
export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidateId = parseInt(id);

    const candidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        deletedAt: null,
      },
      include: {
        education: true,
        workExperience: true,
        skills: true,
        languages: true,
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            uploadedAt: true,
          },
        },
      },
    });

    if (!candidate) {
      return res.status(404).json(formatError(translate('common.errors.candidateNotFound', req.language)));
    }

    return res.status(200).json(formatResponse(candidate, translate('common.success.operationSuccessful', req.language)));
  } catch (error) {
    console.error('Error getting candidate:', error);
    return res.status(500).json(formatError(translate('common.errors.somethingWentWrong', req.language)));
  }
};

/**
 * Update a candidate
 * @route PUT /api/candidates/:id
 */
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidateId = parseInt(id);
    const updateData = req.body;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        deletedAt: null,
      },
    });

    if (!existingCandidate) {
      return res.status(404).json(formatError(translate('common.errors.candidateNotFound', req.language)));
    }

    // Remove related data from updateData if present
    // These should be updated via separate endpoints
    const {
      education,
      workExperience,
      skills,
      languages,
      documents,
      ...candidateData
    } = updateData;

    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: candidateData,
      include: {
        education: true,
        workExperience: true,
        skills: true,
        languages: true,
        documents: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            uploadedAt: true,
          },
        },
      },
    });

    return res.status(200).json(formatResponse(updatedCandidate, translate('common.success.candidateUpdated', req.language)));
  } catch (error) {
    console.error('Error updating candidate:', error);
    return res.status(500).json(formatError(translate('common.errors.failedToUpdate', req.language)));
  }
};

/**
 * Delete a candidate (soft delete)
 * @route DELETE /api/candidates/:id
 */
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidateId = parseInt(id);

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        deletedAt: null,
      },
    });

    if (!existingCandidate) {
      return res.status(404).json(formatError(translate('common.errors.candidateNotFound', req.language)));
    }

    // Soft delete the candidate
    await prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return res
      .status(200)
      .json(formatResponse(null, translate('common.success.candidateDeleted', req.language)));
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return res.status(500).json(formatError(translate('common.errors.failedToDelete', req.language)));
  }
};

/**
 * Upload a document for a candidate
 * @route POST /api/candidates/:id/documents
 */
export const uploadCandidateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidateId = parseInt(id);
    const { isLinkedinCv } = req.body;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
        deletedAt: null,
      },
    });

    if (!existingCandidate) {
      return res.status(404).json(formatError(translate('common.errors.candidateNotFound', req.language)));
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json(formatError(translate('common.errors.noFileUploaded', req.language)));
    }

    // Check file type
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json(formatError(translate('common.errors.onlyPdfAccepted', req.language)));
    }

    // Create timestamp for file name
    const timestamp = Date.now();
    const fileName = `CV_${existingCandidate.email}_${timestamp}.pdf`;

    // Update candidate isLinkedinCv field if provided
    if (isLinkedinCv) {
      await prisma.candidate.update({
        where: {
          id: candidateId,
        },
        data: {
          isLinkedinCv: isLinkedinCv === 'true',
        },
      });
    }

    // Save document to database
    const document = await prisma.candidateDocument.create({
      data: {
        candidateId,
        fileName,
        fileType: req.file.mimetype,
        fileContent: req.file.buffer,
      },
    });

    // Return document data without the binary content
    const { fileContent, ...documentData } = document;
    return res.status(201).json(formatResponse(documentData, translate('common.success.documentUploaded', req.language)));
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json(formatError(translate('common.errors.failedToUpload', req.language)));
  }
};