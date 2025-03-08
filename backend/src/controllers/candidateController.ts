import { Request, Response } from 'express';
import prisma from '../index';

// Get all candidates
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// Get a single candidate by ID
export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
};

// Create a new candidate
export const createCandidate = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, address, education, workExperience } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if candidate with email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      return res.status(409).json({ error: 'A candidate with this email already exists' });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education: education ? JSON.parse(JSON.stringify(education)) : undefined,
        workExperience: workExperience ? JSON.parse(JSON.stringify(workExperience)) : undefined,
      },
    });

    res.status(201).json(newCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
};

// Update an existing candidate
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, education, workExperience, status } = req.body;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education: education ? JSON.parse(JSON.stringify(education)) : undefined,
        workExperience: workExperience ? JSON.parse(JSON.stringify(workExperience)) : undefined,
        status: status ? status : undefined,
      },
    });

    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

// Delete a candidate
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    await prisma.candidate.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};

// Upload resume for a candidate
export const uploadResume = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const { id } = req.params;
    const resumeUrl = req.file?.path;

    if (!resumeUrl) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        resumeUrl,
      },
    });

    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
}; 