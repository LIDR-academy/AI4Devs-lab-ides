import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { handleFileUpload } from '../utils/fileUpload';
import path from 'path';
import fs from 'fs';

const router = Router();
// Use the type assertion to tell the linter that the model exists
// This is needed because the Prisma client types don't always reflect the schema correctly
const prisma = new PrismaClient() as PrismaClient & {
  candidate: any;
  education: any;
};

// Get all candidates
router.get('/', async (req, res) => {
  try {
    // Check if Prisma is connected
    try {
      await prisma.$connect();
    } catch (connectError) {
      console.error('Error connecting to database:', connectError);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: String(connectError)
      });
    }

    const candidates = await prisma.candidate.findMany({
      include: {
        education: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch candidates', 
      details: String(error),
      stack: (error as Error).stack
    });
  }
});

// Get candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
      include: {
        education: true
      }
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error(`Error fetching candidate ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

// Download resume file
router.get('/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) }
    });
    
    if (!candidate || !candidate.resumeFilename) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    const filePath = path.join(process.cwd(), 'uploads', candidate.resumeFilename);
    
    if (!fs.existsSync(filePath)) {
      console.error('Resume file not found at path:', filePath);
      return res.status(404).json({ error: 'Resume file not found' });
    }
    
    res.setHeader('Content-Disposition', `attachment; filename=${candidate.resumeOriginalName}`);
    res.setHeader('Content-Type', candidate.resumeMimetype || 'application/octet-stream');
    
    const filestream = fs.createReadStream(filePath);
    filestream.pipe(res);
  } catch (error) {
    console.error(`Error downloading resume for candidate ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

// Create a new candidate
router.post('/', async (req: Request, res: Response) => {
  try {
    // Handle file upload first
    const file = await handleFileUpload(req);
    
    // Get the form data from req.body
    const { name, email, phone, position, status, notes, education } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !position || !status) {
      // If a file was uploaded but validation fails, delete it
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Parse education data if provided
    let educationData = [];
    if (education) {
      try {
        // Check if already a string or object
        if (typeof education === 'string') {
          educationData = JSON.parse(education);
        } else if (Array.isArray(education)) {
          educationData = education;
        } else if (typeof education === 'object') {
          educationData = [education];
        }
      } catch (e) {
        console.error('Error parsing education data:', e);
        // Continue with empty education data rather than failing
      }
    }
    
    // Validate education data format
    if (Array.isArray(educationData) && educationData.length > 0) {
      educationData = educationData.map((edu: any) => {
        // Make sure all required fields are present
        if (!edu.degree || !edu.institution || !edu.fieldOfStudy) {
          console.warn('Education entry missing required fields:', edu);
        }
        
        // Ensure proper types for all fields
        return {
          degree: String(edu.degree || ''),
          institution: String(edu.institution || ''),
          fieldOfStudy: String(edu.fieldOfStudy || ''),
          startYear: Number(edu.startYear) || new Date().getFullYear(),
          endYear: edu.endYear ? Number(edu.endYear) : null,
          isCurrentlyStudying: edu.isCurrentlyStudying === true
        };
      });
    }
    
    // Create candidate with file details if a file was uploaded
    try {
      const candidate = await prisma.candidate.create({
        data: {
          name,
          email,
          phone,
          position,
          status,
          resumeFilename: file ? path.basename(file.path) : null,
          resumeOriginalName: file ? file.originalname : null,
          resumeMimetype: file ? file.mimetype : null,
          resumeSize: file ? file.size : null,
          notes
        },
        include: {
          education: true
        }
      });
      
      // Now create education records separately if any
      if (Array.isArray(educationData) && educationData.length > 0) {
        for (const edu of educationData) {
          try {
            await prisma.education.create({
              data: {
                ...edu,
                candidateId: candidate.id
              }
            });
          } catch (eduError) {
            console.error('Failed to create education record:', edu, eduError);
          }
        }
        
        // Fetch the updated candidate with education
        const updatedCandidate = await prisma.candidate.findUnique({
          where: { id: candidate.id },
          include: {
            education: true
          }
        });
        
        return res.status(201).json(updatedCandidate);
      }
      
      return res.status(201).json(candidate);
    } catch (dbError) {
      console.error('Database error creating candidate:', dbError);
      if ((dbError as any).code === 'P2002') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ 
        error: 'Failed to create candidate', 
        details: String(dbError),
        stack: (dbError as Error).stack
      });
    }
  } catch (error) {
    console.error('Top level error creating candidate:', error);
    res.status(500).json({ 
      error: 'Failed to create candidate',
      details: String(error),
      stack: (error as Error).stack
    });
  }
});

// Update a candidate
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Handle file upload first
    const file = await handleFileUpload(req);
    
    // Get the form data from req.body
    const { name, email, phone, position, status, notes, education } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !position) {
      // If a file was uploaded but validation fails, delete it safely
      if (file && file.path) {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (error) {
          // Just log the error but don't let it fail the request
          console.error(`Error cleaning up file after validation failure:`, error);
        }
      }
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Parse education data if provided
    let educationData = [];
    if (education) {
      try {
        if (typeof education === 'string') {
          educationData = JSON.parse(education);
        } else if (Array.isArray(education)) {
          educationData = education;
        } else if (typeof education === 'object') {
          educationData = [education];
        }
      } catch (e) {
        console.error('Error parsing education data:', e);
      }
    }
    
    try {
      // First find the existing candidate to get the old resume path
      const existingCandidate = await prisma.candidate.findUnique({
        where: { id: Number(id) }
      });
      
      if (!existingCandidate) {
        // If a file was uploaded but candidate doesn't exist, delete it safely
        if (file && file.path) {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (error) {
            console.error(`Error cleaning up file for non-existent candidate:`, error);
          }
        }
        return res.status(404).json({ error: 'Candidate not found' });
      }
      
      // Delete old resume file if a new one is uploaded and old one exists
      if (file && file.path && existingCandidate.resumeFilename) {
        const oldFilePath = path.join(process.cwd(), 'uploads', existingCandidate.resumeFilename);
        try {
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (fileError) {
          // Just log the error but continue with the update
          console.error(`Error deleting old resume file ${oldFilePath}:`, fileError);
        }
      }
      
      // Update the candidate
      const updateData = {
        name,
        email,
        phone,
        position,
        status: status || existingCandidate.status,
        notes,
        ...(file && file.filename && {
          resumeFilename: file.filename,
          resumeOriginalName: file.originalname,
          resumeMimetype: file.mimetype,
          resumeSize: file.size
        })
      };
      
      // Update candidate first
      const candidate = await prisma.candidate.update({
        where: { id: Number(id) },
        data: updateData
      });
      
      // Handle education records separately
      if (Array.isArray(educationData)) {
        // First delete all existing education records for this candidate
        await prisma.education.deleteMany({
          where: { candidateId: Number(id) }
        });
        
        // Then add new education records
        if (educationData.length > 0) {
          for (const edu of educationData) {
            try {
              await prisma.education.create({
                data: {
                  degree: String(edu.degree || ''),
                  institution: String(edu.institution || ''),
                  fieldOfStudy: String(edu.fieldOfStudy || ''),
                  startYear: Number(edu.startYear) || new Date().getFullYear(),
                  endYear: edu.endYear ? Number(edu.endYear) : null,
                  isCurrentlyStudying: edu.isCurrentlyStudying === true,
                  candidateId: Number(id)
                }
              });
            } catch (eduError) {
              console.error('Failed to create education record:', edu, eduError);
            }
          }
        }
      }
      
      // Get the updated candidate with education
      const updatedCandidate = await prisma.candidate.findUnique({
        where: { id: Number(id) },
        include: { education: true }
      });
      
      res.json(updatedCandidate);
    } catch (error) {
      console.error(`Error updating candidate ${req.params.id}:`, error);
      if ((error as any).code === 'P2025') {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.status(500).json({ 
        error: 'Failed to update candidate',
        details: String(error),
        stack: (error as Error).stack
      });
    }
  } catch (error) {
    console.error(`Top level error updating candidate ${req.params.id}:`, error);
    res.status(500).json({ 
      error: 'Failed to update candidate',
      details: String(error),
      stack: (error as Error).stack
    });
  }
});

// Delete a candidate
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First find the candidate to get their resume info
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) }
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Delete associated education records
    await prisma.education.deleteMany({
      where: { candidateId: Number(id) }
    });
    
    // Delete the candidate
    await prisma.candidate.delete({
      where: { id: Number(id) }
    });
    
    // Delete resume file if it exists
    if (candidate.resumeFilename) {
      const filePath = path.join(process.cwd(), 'uploads', candidate.resumeFilename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error(`Error deleting resume file ${filePath}:`, fileError);
      }
    }
    
    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting candidate ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

export default router; 