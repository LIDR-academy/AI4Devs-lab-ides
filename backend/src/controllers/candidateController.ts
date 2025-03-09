import { Request, Response } from 'express';
import prisma from '../index';
import { encrypt } from '../services/encryptionService';
import path from 'path';
import fs from 'fs';

// Get all candidates with security measures
export const getCandidates = async (req: Request, res: Response) => {
  try {
    // Audit logging
    console.log(
      `Candidates list accessed by ${req.user?.email || 'anonymous'} at ${new Date().toISOString()}`,
    );

    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      // Don't return sensitive data in list view
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        cvFilePath: true,
        createdAt: true,
        updatedAt: true,
        consentGiven: true,
        // Exclude sensitive fields like address, education details
      },
    });

    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    // Generic error message to avoid exposing system details
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// Get a single candidate by ID with security measures
export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid candidate ID' });
    }

    const candidateId = Number(id);

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Audit logging
    console.log(
      `Candidate ID ${id} accessed by ${req.user?.email || 'anonymous'} at ${new Date().toISOString()}`,
    );

    // Update last accessed information
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        lastAccessedAt: new Date(),
        lastAccessedBy: req.user?.userId || null,
      },
    });

    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
};

// Create a new candidate with security measures
export const createCandidate = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      workExperience,
    } = req.body;

    // No longer checking for consent - assuming it's always given

    // Check if file was uploaded
    const cvFilePath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('File upload info:', {
      fileExists: !!req.file,
      filename: req.file?.filename,
      cvFilePath,
    });

    // Check if email already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      // If a file was uploaded, delete it since we're not creating the candidate
      if (req.file) {
        const filePath = path.join(
          __dirname,
          '../../uploads',
          req.file.filename,
        );
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }

      return res.status(400).json({ error: 'Email already in use' });
    }

    // No encryption for any fields
    const newCandidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address, // No longer encrypted
        education,
        workExperience,
        cvFilePath,
        consentGiven: true, // Always set to true
        createdBy: req.user?.userId || null,
      },
    });

    // Audit logging
    console.log(
      `New candidate created: ${newCandidate.id} by ${req.user?.email || 'anonymous'} at ${new Date().toISOString()}`,
    );

    res.status(201).json(newCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);

    // If a file was uploaded, delete it since we're not creating the candidate
    if (req.file) {
      try {
        const filePath = path.join(
          __dirname,
          '../../uploads',
          req.file.filename,
        );
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({ error: 'Failed to create candidate' });
  }
};

// Delete a candidate by ID
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid candidate ID' });
    }

    const candidateId = Number(id);

    // Check if candidate exists and get CV file path
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: { id: true, cvFilePath: true },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Delete the CV file if it exists
    if (candidate.cvFilePath) {
      try {
        // Remove the leading slash from the path if it exists
        const relativePath = candidate.cvFilePath.startsWith('/')
          ? candidate.cvFilePath.substring(1)
          : candidate.cvFilePath;

        const filePath = path.join(__dirname, '../..', relativePath);
        console.log(`Attempting to delete CV file at: ${filePath}`);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Successfully deleted CV file for candidate ${id}`);
        } else {
          console.warn(`CV file not found at path: ${filePath}`);
        }
      } catch (fileError) {
        console.error(`Error deleting CV file for candidate ${id}:`, fileError);
        // Continue with deletion even if file removal fails
      }
    }

    // Delete the candidate from the database
    await prisma.candidate.delete({
      where: { id: candidateId },
    });

    // Audit logging
    console.log(
      `Candidate ID ${id} deleted by ${req.user?.email || 'anonymous'} at ${new Date().toISOString()}`,
    );

    res.status(200).json({
      message: 'Candidate deleted successfully',
      id: candidateId,
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};
