import { z } from 'zod';

/**
 * Esquema base para la validación de usuarios
 */
export const userBaseSchema = z.object({
  email: z
    .string()
    .email('El email debe tener un formato válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .optional(),
  role: z
    .enum(['admin', 'recruiter', 'manager'], {
      errorMap: () => ({ message: 'El rol debe ser admin, recruiter o manager' }),
    })
    .default('recruiter'),
  isActive: z.boolean().default(true),
});

/**
 * Esquema para la creación de usuarios
 */
export const createUserSchema = userBaseSchema.extend({
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede tener más de 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

/**
 * Esquema para la actualización de usuarios
 */
export const updateUserSchema = userBaseSchema
  .partial()
  .extend({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña no puede tener más de 100 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      )
      .optional(),
    confirmPassword: z.string().optional(),
    currentPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si se proporciona una contraseña, también debe proporcionarse la confirmación
      if (data.password) {
        return data.confirmPassword !== undefined;
      }
      return true;
    },
    {
      message: 'Debe proporcionar la confirmación de la contraseña',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona una contraseña, debe coincidir con la confirmación
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona una contraseña, también debe proporcionarse la contraseña actual
      if (data.password) {
        return data.currentPassword !== undefined;
      }
      return true;
    },
    {
      message: 'Debe proporcionar la contraseña actual para cambiar la contraseña',
      path: ['currentPassword'],
    }
  );

/**
 * Esquema para el inicio de sesión
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('El email debe tener un formato válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(100, 'La contraseña no puede tener más de 100 caracteres'),
});

/**
 * Esquema para el cambio de contraseña
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .max(100, 'La nueva contraseña no puede tener más de 100 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      ),
    confirmPassword: z.string().min(1, 'La confirmación de la contraseña es requerida'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword'],
  });

// Tipos derivados de los esquemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>; 