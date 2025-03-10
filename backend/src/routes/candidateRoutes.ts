import express, { Request, Response, NextFunction } from 'express';
import { 
  getAllCandidates, 
  getCandidateById, 
  createCandidate, 
  updateCandidate, 
  deleteCandidate 
} from '../controllers/candidateController';
import upload from '../middleware/fileUpload';

const router = express.Router();

// Type-safe wrapper for request handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Get all candidates
router.get('/', asyncHandler(getAllCandidates));

// Get a single candidate
router.get('/:id', asyncHandler(getCandidateById));

// Create a new candidate with file upload
router.post('/', 
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('cvFile')(req as any, res as any, (err: any) => {
      if (err) return next(err);
      next();
    });
  },
  asyncHandler(createCandidate)
);

// Update a candidate
router.put('/:id', 
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('cvFile')(req as any, res as any, (err: any) => {
      if (err) return next(err);
      next();
    });
  },
  asyncHandler(updateCandidate)
);

// Delete a candidate
router.delete('/:id', asyncHandler(deleteCandidate));

export default router;
