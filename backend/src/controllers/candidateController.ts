import { Request, Response } from 'express';
import prisma from '../index';
import { getRelativeFilePath } from '../utils/fileHelper';

// Create a new candidate
export const createCandidate = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      experience,
    } = req.body;

    // Handle file upload if present
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = getRelativeFilePath(req.file.path);
    }

    // Create candidate with simplified fields
    const newCandidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        experience,
        resumeUrl,
      },
    });

    res.status(201).json({
      success: true,
      data: newCandidate,
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create candidate',
    });
  }
};

// Get all candidates
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany();

    res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve candidates',
    });
  }
};
