import { z } from 'zod';
import { Status } from './status.enum';

export const candidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().nullable().optional(),
  address: z.string().max(100, 'Address must be 100 characters or less'),
  education: z.string().min(1, 'Education is required'),
  experience: z.string().min(1, 'Experience is required'),
  status: z.nativeEnum(Status).optional().default(Status.PENDING),
});

export const candidateUpdateSchema = candidateSchema.partial();

export const candidateWithIdSchema = candidateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  cvFilePath: z.string().nullable().optional(),
});

export type CandidateInput = z.infer<typeof candidateSchema>;
export type CandidateUpdateInput = z.infer<typeof candidateUpdateSchema>;
export type CandidateWithId = z.infer<typeof candidateWithIdSchema>;
