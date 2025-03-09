/**
 * Candidate domain aggregate index file
 * Exports all the components of the Candidate aggregate
 */

// Entity exports
export { Candidate, ICandidate } from './entity';

// Repository exports
export { ICandidateRepository } from './repository';

// Schema exports
export {
  CandidateInput,
  CandidateUpdateInput,
  CandidateWithId,
  candidateSchema,
  candidateUpdateSchema,
  candidateWithIdSchema,
} from './schema';

// Status enum exports
export { Status, isValidStatus } from './status.enum';
