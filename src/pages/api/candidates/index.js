import { createRouter } from "next-connect";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { getCandidates, addCandidate } from "../../../lib/database";

// Configuración de almacenamiento para archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determina la carpeta de destino según el tipo de archivo
    const uploadDir =
      file.fieldname === "cv"
        ? "./public/uploads/cv"
        : "./public/uploads/photos";

    // Crea el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genera un nombre único para el archivo
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configuración de filtro para tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "cv") {
    // Para CV, aceptar solo PDF y DOCX
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Formato de CV no válido. Solo se permiten archivos PDF o DOCX."
        ),
        false
      );
    }
  } else if (file.fieldname === "photo") {
    // Para fotos, aceptar solo formatos de imagen comunes
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Formato de imagen no válido. Solo se permiten JPEG, PNG, GIF o WEBP."
        ),
        false
      );
    }
  } else {
    cb(null, false);
  }
};

// Configuración de multer para la carga de archivos
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

// Configuración para middlewares de carga de archivos
const uploadMiddleware = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]);

// Crear el router para la API
const router = createRouter();

// Middleware global para manejar errores
router.use(async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    console.error("Error en API de candidatos:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error interno del servidor",
    });
  }
});

// Manejador para GET - Obtener todos los candidatos o filtrados
router.get(async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Usar la función de la base de datos para obtener candidatos
    const result = getCandidates({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    console.error("Error al obtener candidatos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la lista de candidatos",
    });
  }
});

// Manejador para POST - Crear un nuevo candidato
router.post((req, res) => {
  // Usamos un middleware personalizado para manejar la carga de archivos
  uploadMiddleware(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    try {
      // Parsear los datos del formulario
      const personalInfo = JSON.parse(req.body.personalInfo || "{}");
      const education = JSON.parse(req.body.education || "[]");
      const experience = JSON.parse(req.body.experience || "[]");

      // Validar campos obligatorios
      if (
        !personalInfo.name ||
        !personalInfo.surnames ||
        !personalInfo.email ||
        !personalInfo.phone
      ) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos obligatorios en la información personal",
        });
      }

      // Crear registro de documentos
      const documents = {};

      // Añadir CV si existe
      if (req.files && req.files["cv"]) {
        documents.cv = req.files["cv"][0].path.replace("public", "");
      }

      // Añadir foto si existe
      if (req.files && req.files["photo"]) {
        documents.photo = req.files["photo"][0].path.replace("public", "");
      }

      // Crear el nuevo candidato usando la función de la base de datos
      const newCandidate = addCandidate({
        id: uuidv4(),
        personalInfo,
        education,
        experience,
        documents,
      });

      res.status(201).json({
        success: true,
        data: newCandidate,
        message: "Candidato añadido correctamente",
      });
    } catch (error) {
      console.error("Error al crear candidato:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear el candidato",
      });
    }
  });
});

// Exportar el router como handler de la API
export default router.handler();

// Configuración para parsear correctamente el body con archivos
export const config = {
  api: {
    bodyParser: false,
  },
};
