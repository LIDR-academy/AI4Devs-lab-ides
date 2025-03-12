import Joi from 'joi';

// Esquema de validación para la educación
export const educationSchema = Joi.object({
  institution: Joi.string().required().trim().max(255)
    .messages({
      'string.empty': 'La institución es obligatoria',
      'string.max': 'La institución no puede exceder los 255 caracteres',
      'any.required': 'La institución es obligatoria'
    }),
  degree: Joi.string().required().trim().max(255)
    .messages({
      'string.empty': 'El título es obligatorio',
      'string.max': 'El título no puede exceder los 255 caracteres',
      'any.required': 'El título es obligatorio'
    }),
  fieldOfStudy: Joi.string().required().trim().max(255)
    .messages({
      'string.empty': 'El campo de estudio es obligatorio',
      'string.max': 'El campo de estudio no puede exceder los 255 caracteres',
      'any.required': 'El campo de estudio es obligatorio'
    }),
  startDate: Joi.date().required()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'any.required': 'La fecha de inicio es obligatoria'
    }),
  endDate: Joi.date().allow(null)
    .messages({
      'date.base': 'La fecha de finalización debe ser una fecha válida'
    }),
  description: Joi.string().allow('').max(1000)
    .messages({
      'string.max': 'La descripción no puede exceder los 1000 caracteres'
    })
});

// Esquema de validación para la experiencia laboral
export const workExperienceSchema = Joi.object({
  company: Joi.string().required().trim().max(255)
    .messages({
      'string.empty': 'La empresa es obligatoria',
      'string.max': 'La empresa no puede exceder los 255 caracteres',
      'any.required': 'La empresa es obligatoria'
    }),
  position: Joi.string().required().trim().max(255)
    .messages({
      'string.empty': 'El cargo es obligatorio',
      'string.max': 'El cargo no puede exceder los 255 caracteres',
      'any.required': 'El cargo es obligatorio'
    }),
  location: Joi.string().allow('').max(255)
    .messages({
      'string.max': 'La ubicación no puede exceder los 255 caracteres'
    }),
  startDate: Joi.date().required()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'any.required': 'La fecha de inicio es obligatoria'
    }),
  endDate: Joi.date().allow(null)
    .messages({
      'date.base': 'La fecha de finalización debe ser una fecha válida'
    }),
  description: Joi.string().allow('').max(1000)
    .messages({
      'string.max': 'La descripción no puede exceder los 1000 caracteres'
    })
});

// Esquema de validación para el candidato
export const candidateSchema = Joi.object({
  firstName: Joi.string().required().trim().max(100)
    .messages({
      'string.empty': 'El nombre es obligatorio',
      'string.max': 'El nombre no puede exceder los 100 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
  lastName: Joi.string().required().trim().max(100)
    .messages({
      'string.empty': 'El apellido es obligatorio',
      'string.max': 'El apellido no puede exceder los 100 caracteres',
      'any.required': 'El apellido es obligatorio'
    }),
  email: Joi.string().required().email().trim().max(255)
    .messages({
      'string.empty': 'El email es obligatorio',
      'string.email': 'El email debe tener un formato válido',
      'string.max': 'El email no puede exceder los 255 caracteres',
      'any.required': 'El email es obligatorio'
    }),
  phone: Joi.string().required().trim().max(20)
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/)
    .messages({
      'string.empty': 'El teléfono es obligatorio',
      'string.max': 'El teléfono no puede exceder los 20 caracteres',
      'string.pattern.base': 'El teléfono debe tener un formato válido',
      'any.required': 'El teléfono es obligatorio'
    }),
  address: Joi.string().allow('').max(255)
    .messages({
      'string.max': 'La dirección no puede exceder los 255 caracteres'
    }),
  education: Joi.array().items(educationSchema).min(1).required()
    .messages({
      'array.min': 'Debe incluir al menos una entrada de educación',
      'any.required': 'La educación es obligatoria'
    }),
  workExperience: Joi.array().items(workExperienceSchema).min(0)
    .messages({
      'array.base': 'La experiencia laboral debe ser un array'
    }),
  cvFilePath: Joi.string().allow('').optional()
    .messages({
      'string.base': 'La ruta del archivo CV debe ser una cadena de texto'
    })
}); 