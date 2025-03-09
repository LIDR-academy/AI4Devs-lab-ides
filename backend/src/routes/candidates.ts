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
  console.log('GET /candidates request received');
  try {
    // Check if Prisma is connected
    try {
      await prisma.$connect();
      console.log('Prisma connected successfully');
    } catch (connectError) {
      console.error('Error connecting to database:', connectError);
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: String(connectError)
      });
    }

    console.log('Attempting to fetch candidates');
    const candidates = await prisma.candidate.findMany({
      include: {
        education: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${candidates.length} candidates`);
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
    console.log('Resume file path:', filePath);
    
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
    
    // Debug the received data
    console.log('Received education data:', education);
    console.log('Request body:', req.body);
    
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
          console.log('Education data is a string, attempting to parse');
          educationData = JSON.parse(education);
        } else if (Array.isArray(education)) {
          console.log('Education data is already an array');
          educationData = education;
        } else if (typeof education === 'object') {
          console.log('Education data is an object, converting to array');
          educationData = [education];
        }
        console.log('Parsed education data:', educationData);
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
        console.log('Creating', educationData.length, 'education records for candidate', candidate.id);
        
        for (const edu of educationData) {
          try {
            const educationRecord = await prisma.education.create({
              data: {
                ...edu,
                candidateId: candidate.id
              }
            });
            console.log('Created education record:', educationRecord);
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
  console.log('📝 PUT /candidates/:id route hit');
  console.log('Candidate ID for update:', req.params.id);
  console.log('Request body keys:', Object.keys(req.body));
  console.log('Request headers:', req.headers);
  
  try {
    const { id } = req.params;
    
    // Handle file upload first
    const file = await handleFileUpload(req);
    console.log('File upload processed:', file ? 'File received' : 'No file received');
    
    // Get the form data from req.body
    const { name, email, phone, position, status, notes, education } = req.body;
    console.log('Update - Request data:', { name, email, phone, position, status, notes });
    console.log('Update - Received education data:', education);
    
    // Get existing candidate to check if we need to delete an old resume
    const existingCandidate = await prisma.candidate.findUnique({
      where: { id: Number(id) },
      include: {
        education: true
      }
    });
    
    if (!existingCandidate) {
      // If a file was uploaded but candidate doesn't exist, delete it
      if (file && file.path) {
        fs.unlinkSync(file.path);
      }
      return res.status(404).json({ error: 'Candidate not found' });
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
        console.log('Update - Parsed education data:', educationData);
      } catch (e) {
        console.error('Update - Error parsing education data:', e);
        // Continue with empty education data rather than failing
      }
    }
    
    // Prepare update data
    const updateData: any = {
      name,
      email,
      phone,
      position,
      status,
      notes
    };
    
    // If a new file was uploaded, add file details
    if (file) {
      updateData.resumeFilename = path.basename(file.path);
      updateData.resumeOriginalName = file.originalname;
      updateData.resumeMimetype = file.mimetype;
      updateData.resumeSize = file.size;
      
      // Delete old file if exists
      if (existingCandidate.resumeFilename) {
        const oldFilePath = path.join(process.cwd(), 'uploads', existingCandidate.resumeFilename);
        console.log('Attempting to delete old resume file:', oldFilePath);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
            console.log('Successfully deleted old resume file');
          } catch (err) {
            console.error('Error deleting old resume file:', err);
            // Continue processing even if delete fails
          }
        } else {
          console.log('Old resume file does not exist:', oldFilePath);
        }
      }
    }
    
    // First, delete all existing education records
    try {
      await prisma.education.deleteMany({
        where: {
          candidateId: Number(id)
        }
      });
    } catch (e) {
      console.error('Error deleting existing education records:', e);
    }
    
    // Update candidate
    const candidate = await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        education: {
          create: Array.isArray(educationData) && educationData.length > 0 
            ? educationData.map((edu: any) => ({
                degree: edu.degree || '',
                institution: edu.institution || '',
                fieldOfStudy: edu.fieldOfStudy || '',
                startYear: Number(edu.startYear) || new Date().getFullYear(),
                endYear: edu.endYear ? Number(edu.endYear) : null,
                isCurrentlyStudying: edu.isCurrentlyStudying === true
              }))
            : []
        }
      },
      include: {
        education: true
      }
    });
    
    res.json(candidate);
  } catch (error) {
    console.error(`Error updating candidate ${req.params.id}:`, error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    if ((error as any).code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update candidate', details: String(error) });
  }
});

// Delete a candidate
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get candidate to check for resume file
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(id) }
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Delete resume file if exists
    if (candidate.resumeFilename) {
      const filePath = path.join(process.cwd(), 'uploads', candidate.resumeFilename);
      console.log('Attempting to delete resume file:', filePath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log('Successfully deleted resume file');
        } catch (err) {
          console.error('Error deleting resume file:', err);
          // Continue processing even if delete fails
        }
      } else {
        console.log('Resume file does not exist:', filePath);
      }
    }
    
    // Delete candidate from database
    await prisma.candidate.delete({
      where: { id: Number(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting candidate ${req.params.id}:`, error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

export default router; 