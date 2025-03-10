import { Router } from "express";
import multer from "multer";
import { createCandidato } from "../controllers/candidatoController";
import { authenticate } from "../middlewares/authMiddleware";

// Configure Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the "uploads" directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedOriginal = file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueSuffix + "-" + sanitizedOriginal);
  },
});
const upload = multer({ storage });

const router = Router();

// POST /candidatos endpoint protected with JWT and handling file upload (field name: cv)
router.post("/candidatos", authenticate, upload.single("cv"), createCandidato);

export default router;