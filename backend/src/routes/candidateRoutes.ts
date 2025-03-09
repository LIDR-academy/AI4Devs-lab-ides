import express from 'express';
import {
  createCandidate,
  getCandidates,
} from '../controllers/candidateController';
import { validateCandidate } from '../middleware/validationMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Create a new candidate
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               address:
 *                 type: string
 *                 example: 123 Main St, City, Country
 *               education:
 *                 type: string
 *                 example: BS in Computer Science, Harvard University, 2018-2022
 *               experience:
 *                 type: string
 *                 example: Software Engineer at Google, 2022-Present
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Candidate's resume (PDF or DOCX)
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', upload.single('resume'), validateCandidate, createCandidate);

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     responses:
 *       200:
 *         description: List of candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 */
router.get('/', getCandidates);

export default router;
