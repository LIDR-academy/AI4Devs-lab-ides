import { Request, Response } from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { createCandidate } from '../candidateRepository';

const upload = multer({ dest: 'uploads/' });

export const createCandidateHandler = [
  // Use upload.single for the file and ensure it's before the validation middlewares
  upload.single('cv'),
  // Validation middlewares
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('education').custom((value) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== 'object') throw new Error('Must be an object');
      return true;
    } catch (e) {
      throw new Error('Invalid education format');
    }
  }),
  body('work_experience').custom((value) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== 'object') throw new Error('Must be an object');
      return true;
    } catch (e) {
      throw new Error('Invalid work experience format');
    }
  }),

  // Handler function
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const candidateData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        education: JSON.parse(req.body.education),
        work_experience: JSON.parse(req.body.work_experience),
        cv_url: req.file ? req.file.path : '',
      };

      const candidate = await createCandidate(candidateData);
      res.status(201).json(candidate);
    } catch (error) {
      console.error('Error creating candidate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
];
