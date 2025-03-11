import { z } from 'zod';
import { Status } from '@prisma/client';

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().max(100).optional(),
  education: z.string().min(1, 'Education is required'),
  experience: z.string().min(1, 'Experience is required'),
  status: z.nativeEnum(Status).default('WAITING'),
});

export const updateCandidateSchema = createCandidateSchema.partial();

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
