import { createRouter } from "next-connect";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../../../lib/database";

// Importamos la configuración de multer similar a index.js
// En producción, sería mejor tener un archivo de configuración compartido
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir =
      file.fieldname === "cv"
        ? "./public/uploads/cv"
        : "./public/uploads/photos";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "cv") {
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

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

const uploadMiddleware = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]);

// Crear el router
const router = createRouter();

// Middleware para manejar errores
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

// Manejador para GET - Obtener un candidato por ID
router.get(async (req, res) => {
  try {
    const { id } = req.query;

    // Usar la función de la base de datos para obtener el candidato
    const candidate = getCandidateById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidato no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error(`Error al obtener candidato con ID ${req.query.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el candidato",
    });
  }
});

// Manejador para PUT - Actualizar un candidato
router.put((req, res) => {
  // Usamos el middleware de carga de archivos
  uploadMiddleware(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    try {
      const { id } = req.query;

      // Obtener el candidato actual
      const currentCandidate = getCandidateById(id);

      if (!currentCandidate) {
        return res.status(404).json({
          success: false,
          message: "Candidato no encontrado",
        });
      }

      // Parsear los datos actualizados
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

      // Preparar documentos actualizados
      const documents = { ...currentCandidate.documents };

      // Actualizar CV si se proporcionó uno nuevo
      if (req.files && req.files["cv"]) {
        // Eliminar el archivo anterior si existe
        if (documents.cv && fs.existsSync(`public${documents.cv}`)) {
          fs.unlinkSync(`public${documents.cv}`);
        }
        documents.cv = req.files["cv"][0].path.replace("public", "");
      }

      // Actualizar foto si se proporcionó una nueva
      if (req.files && req.files["photo"]) {
        // Eliminar el archivo anterior si existe
        if (documents.photo && fs.existsSync(`public${documents.photo}`)) {
          fs.unlinkSync(`public${documents.photo}`);
        }
        documents.photo = req.files["photo"][0].path.replace("public", "");
      }

      // Actualizar el candidato usando la función de la base de datos
      const updatedCandidate = updateCandidate(id, {
        personalInfo,
        education,
        experience,
        documents,
      });

      res.status(200).json({
        success: true,
        data: updatedCandidate,
        message: "Candidato actualizado correctamente",
      });
    } catch (error) {
      console.error(
        `Error al actualizar candidato con ID ${req.query.id}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Error al actualizar el candidato",
      });
    }
  });
});

// Manejador para DELETE - Eliminar un candidato
router.delete(async (req, res) => {
  try {
    const { id } = req.query;

    // Obtener el candidato antes de eliminarlo
    const candidate = getCandidateById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidato no encontrado",
      });
    }

    // Eliminar archivos asociados
    if (
      candidate.documents.cv &&
      fs.existsSync(`public${candidate.documents.cv}`)
    ) {
      fs.unlinkSync(`public${candidate.documents.cv}`);
    }

    if (
      candidate.documents.photo &&
      fs.existsSync(`public${candidate.documents.photo}`)
    ) {
      fs.unlinkSync(`public${candidate.documents.photo}`);
    }

    // Eliminar el candidato usando la función de la base de datos
    const deleted = deleteCandidate(id);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el candidato",
      });
    }

    res.status(200).json({
      success: true,
      message: "Candidato eliminado correctamente",
    });
  } catch (error) {
    console.error(`Error al eliminar candidato con ID ${req.query.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el candidato",
    });
  }
});

// Exportar el router como handler de la API
export default router.handler();

// Configuración para parsear correctamente el body con archivos
export const config = {
  api: {
    bodyParser: false,
  },
};
