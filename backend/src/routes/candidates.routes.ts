import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX are allowed'));
        }
    }
});

import fs from 'fs';
if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/');
}

// Create a new candidate
router.post('/', upload.single('cv'), async (req: Request, res: Response) => {
    try {
        // Check for existing email (case insensitive)
        const existingCandidate = await prisma.candidate.findFirst({
            where: {
                email: {
                    equals: req.body.email,
                    mode: 'insensitive'
                }
            }
        });

        if (existingCandidate) {
            return res.status(409).json({
                error: 'Email already exists',
                message: `A candidate with email ${req.body.email} is already registered in the system`
            });
        }

        const candidateData = {
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email.toLowerCase(), // Store email in lowercase
            phone: req.body.phone,
            address: req.body.address,
            education: JSON.parse(req.body.education),
            workExperience: JSON.parse(req.body.workExperience),
            cvUrl: req.file ? `/uploads/${req.file.filename}` : null
        };

        const candidate = await prisma.candidate.create({
            data: candidateData
        });

        res.status(201).json({
            success: true,
            message: 'Candidate added successfully',
            data: candidate
        });
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(400).json({
            error: 'Failed to create candidate',
            message: 'An error occurred while creating the candidate'
        });
    }
});


// Get all candidates
router.get('/', async (_req: Request, res: Response) => {
    try {
        const candidates = await prisma.candidate.findMany();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
});

// Get candidate by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const candidate = await prisma.candidate.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch candidate' });
    }
});

// Update candidate
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const candidate = await prisma.candidate.update({
            where: { id: Number(req.params.id) },
            data: {
                name: req.body.name,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                education: req.body.education,
                workExperience: req.body.workExperience,
                cvUrl: req.body.cvUrl
            }
        });
        res.json(candidate);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update candidate' });
    }
});

// Delete candidate
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await prisma.candidate.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete candidate' });
    }
});

export default router;
