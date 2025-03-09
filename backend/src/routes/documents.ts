import { Router } from 'express';
import { upload, uploadDocument, downloadDocument } from '../controllers/documentController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/upload/:candidateId', auth, upload.single('file'), uploadDocument);
router.get('/:filename', auth, downloadDocument);

export default router;