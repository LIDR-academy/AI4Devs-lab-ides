import express from 'express';
import { DocumentController } from '../controllers/documentController';
import { upload, handleMulterErrors, validateCandidateDocuments } from '../../../middlewares/fileUploadMiddleware';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = express.Router();
const documentController = new DocumentController();

// Middleware para registrar todas las peticiones
router.use((req, res, next) => {
  console.log(`Petición a ruta de documentos: ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * /api/candidates/{candidateId}/documents:
 *   get:
 *     summary: Obtiene todos los documentos de un candidato
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     responses:
 *       200:
 *         description: Documentos obtenidos exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Candidato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/candidates/:candidateId/documents',
  authenticate,
  documentController.getCandidateDocuments
);

/**
 * @swagger
 * /api/candidates/{candidateId}/documents:
 *   post:
 *     summary: Crea un nuevo documento para un candidato
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del candidato
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - fileType
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del documento
 *               type:
 *                 type: string
 *                 enum: [CV, Cover Letter, Certificate, Other]
 *                 description: Tipo de documento
 *               fileType:
 *                 type: string
 *                 enum: [pdf, docx, doc, txt]
 *                 description: Tipo de archivo
 *               isEncrypted:
 *                 type: boolean
 *                 description: Indica si el documento debe ser encriptado
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir
 *     responses:
 *       201:
 *         description: Documento creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Candidato no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/candidates/:candidateId/documents',
  authenticate,
  upload.single('file'),
  handleMulterErrors,
  validateCandidateDocuments,
  documentController.createDocumentValidators,
  documentController.createDocument
);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Obtiene un documento por su ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del documento
 *       - in: query
 *         name: decrypt
 *         schema:
 *           type: boolean
 *         description: Indica si se debe desencriptar el documento
 *       - in: query
 *         name: download
 *         schema:
 *           type: boolean
 *         description: Indica si se debe descargar el documento
 *     responses:
 *       200:
 *         description: Documento obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Documento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/documents/:id',
  authenticate,
  documentController.getDocumentValidators,
  documentController.getDocumentById
);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Elimina un documento por su ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del documento
 *     responses:
 *       200:
 *         description: Documento eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Documento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/documents/:id',
  authenticate,
  documentController.deleteDocumentValidators,
  documentController.deleteDocument
);

export default router; 