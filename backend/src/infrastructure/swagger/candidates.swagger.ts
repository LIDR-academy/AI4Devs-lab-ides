/**
 * @swagger
 * components:
 *   schemas:
 *     Education:
 *       type: object
 *       properties:
 *         institution:
 *           type: string
 *           description: Nombre de la institución educativa
 *         degree:
 *           type: string
 *           description: Título o grado obtenido
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de los estudios
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de finalización de los estudios
 * 
 *     WorkExperience:
 *       type: object
 *       properties:
 *         company:
 *           type: string
 *           description: Nombre de la empresa
 *         position:
 *           type: string
 *           description: Puesto o cargo
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del trabajo
 *         description:
 *           type: string
 *           description: Descripción de las responsabilidades
 * 
 *     Candidate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del candidato
 *         name:
 *           type: string
 *           description: Nombre del candidato
 *         lastName:
 *           type: string
 *           description: Apellido del candidato
 *         email:
 *           type: string
 *           format: email
 *           description: Email del candidato
 *         phone:
 *           type: string
 *           description: Número de teléfono
 *         address:
 *           type: string
 *           description: Dirección del candidato
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Education'
 *           description: Lista de estudios
 *         workExperience:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkExperience'
 *           description: Lista de experiencias laborales
 *         cvUrl:
 *           type: string
 *           description: URL del CV adjunto
 * 
 *   responses:
 *     Error:
 *       description: Error en la operación
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *               details:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Obtiene la lista de todos los candidatos
 *     tags: [Candidates]
 *     responses:
 *       200:
 *         description: Lista de candidatos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidate'
 *       500:
 *         $ref: '#/components/responses/Error'
 * 
 *   post:
 *     summary: Crea un nuevo candidato
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               candidate:
 *                 type: string
 *                 description: Datos del candidato en formato JSON
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CV del candidato
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         $ref: '#/components/responses/Error'
 *       500:
 *         $ref: '#/components/responses/Error'
 */ 