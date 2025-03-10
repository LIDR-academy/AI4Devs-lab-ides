import { z } from 'zod';

export const candidatoSchema = z.object({
  nombre: z.string()
    .nonempty('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .refine(value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value), {
      message: 'El nombre solo debe contener letras y espacios'
    }),
  
  apellido: z.string()
    .nonempty('El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .refine(value => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value), {
      message: 'El apellido solo debe contener letras y espacios'
    }),
  
  email: z.string()
    .nonempty('El correo electrónico es obligatorio')
    .email('Por favor, introduce un correo electrónico válido')
    .max(255, 'El correo electrónico no puede tener más de 255 caracteres')
    .refine(value => value.includes('@') && value.includes('.'), {
      message: 'El correo debe incluir @ y un dominio válido'
    }),
  
  telefono: z.string()
    .nonempty('El teléfono es obligatorio')
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(20, 'El teléfono no puede tener más de 20 caracteres')
    .regex(/^\+?[0-9\s\-()]{8,20}$/, 'El teléfono debe contener solo números, espacios y los símbolos +()-'),
  
  direccion: z.string()
    .max(255, 'La dirección no puede tener más de 255 caracteres')
    .optional()
    .or(z.literal('')),
  
  educacion: z.string()
    .max(200, 'La educación no puede tener más de 200 caracteres')
    .optional()
    .or(z.literal('')),
  
  experiencia_laboral: z.string()
    .max(200, 'La experiencia laboral no puede tener más de 200 caracteres')
    .optional()
    .or(z.literal('')),
  
  cv: z.instanceof(FileList)
    .refine(files => {
      // Si no hay archivos, es válido solo si se está editando un candidato existente
      if (!files || files.length === 0) return true;
      
      const file = files[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      // Verificar tipo de archivo
      if (!validTypes.includes(file.type)) {
        return false;
      }
      
      // Verificar tamaño (máximo 5MB)
      return file.size <= 5 * 1024 * 1024;
    }, 'El archivo debe ser un PDF o DOCX de hasta 5MB')
    .optional()
}); 