import { Request, Response } from 'express';
import prisma from '../index';

// Extend the Express Request interface to include the file property
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export const createCandidate = async (req: RequestWithFile, res: Response) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      education, 
      workExperience 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        message: 'First name, last name, and email are required fields' 
      });
    }

    // Check for existing candidate with the same email
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email }
    });

    if (existingCandidate) {
      return res.status(409).json({ 
        message: 'A candidate with this email already exists' 
      });
    }

    // Handle CV file upload (file path will be set by the file upload middleware)
    const cvFilePath = req.file ? req.file.path : null;

    // Create the candidate in the database
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        education: education || null,
        workExperience: workExperience || null,
        cvFilePath: cvFilePath || null
      }
    });

    return res.status(201).json({
      message: 'Candidate created successfully',
      data: candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return res.status(500).json({ 
      message: 'Server error while creating candidate' 
    });
  }
};

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany();
    return res.status(200).json({ data: candidates });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({ 
      message: 'Server error while fetching candidates' 
    });
  }
}; 