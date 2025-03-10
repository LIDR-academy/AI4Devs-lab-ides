import { z } from 'zod';

export const candidatoSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  
  apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres'),
  
  email: z.string()
    .email('Debe proporcionar un correo electrónico válido')
    .max(255, 'El correo electrónico no puede tener más de 255 caracteres'),
  
  telefono: z.string()
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(20, 'El teléfono no puede tener más de 20 caracteres')
    .regex(/^\+?[0-9\s\-()]{8,20}$/, 'Formato de teléfono inválido'),
  
  direccion: z.string().optional(),
  
  educacion: z.string().optional(),
  
  experiencia_laboral: z.string().optional(),
  
  cv: z.instanceof(FileList).refine(files => {
    if (!files || files.length === 0) return true; // Opcional en caso de edición
    
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
  }, 'Archivo inválido. Debe ser un PDF o DOCX de hasta 5MB').optional()
}); 