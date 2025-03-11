// src/routes/candidateRoutes.ts
import express from 'express';
import multer from 'multer';
import { addCandidate, getCandidates } from '../controllers/candidateController';

const router = express.Router();
const upload = multer();

router.post('/candidates', upload.single('resume'), addCandidate);
router.get('/candidates', getCandidates);

export default router;
