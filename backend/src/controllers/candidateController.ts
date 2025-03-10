import { Request, Response } from 'express';
import prisma from '../index';
import { NextFunction } from 'express';

// Define the file property on Request
declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

// Get all candidates
export const getAllCandidates = async (req: Request, res: Response) => {
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
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      education, 
      workExperience 
    } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: 'First name, last name, and email are required' 
      });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Handle file path (assuming file middleware has processed it)
    const cvFilePath = req.file ? req.file.path : null;
    
    // Create the candidate
    const newCandidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        education: education || null,
        workExperience: workExperience || null,
        cvFilePath: cvFilePath || null,
      },
    });
    
    res.status(201).json(newCandidate);
  } catch (error: any) {
    console.error('Error creating candidate:', error);
    console.error('Error stack:', error.stack);
    
    // Log more details about the error
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.meta) {
      console.error('Error metadata:', error.meta);
    }
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ 
        error: 'A candidate with this email already exists' 
      });
    }
    
    // Return more detailed error information
    res.status(500).json({ 
      error: 'Failed to create candidate', 
      details: error.message || String(error),
      code: error.code || 'UNKNOWN'
    });
  }
};

// Update a candidate
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      education, 
      workExperience 
    } = req.body;
    
    // Email format validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
    }
    
    // Handle file path update if a new file is uploaded
    const cvFilePath = req.file ? req.file.path : undefined;
    
    const updatedCandidate = await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        education,
        workExperience,
        ...(cvFilePath && { cvFilePath }),
      },
    });
    
    res.json(updatedCandidate);
  } catch (error: any) {
    console.error('Error updating candidate:', error);
    
    // Handle record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Handle unique constraint violation
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ 
        error: 'A candidate with this email already exists' 
      });
    }
    
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

// Delete a candidate
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.candidate.delete({
      where: { id: Number(id) },
    });
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting candidate:', error);
    
    // Handle record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};
