// Exportar componentes
export { default as CandidateList } from './components/CandidateList';
export { default as CandidateForm } from './components/CandidateForm';
export { default as DocumentUploadForm } from './components/DocumentUploadForm';
export { default as DocumentList } from './components/DocumentList';

// Exportar hooks
export {
  useGetCandidates,
  useGetCandidateById,
  useCreateCandidate,
  useUpdateCandidate,
  useDeleteCandidate,
} from './hooks/useCandidates';

// Exportar servicios
export { candidateService } from './services/candidateService';

// Exportar tipos
export type {
  Candidate,
  CandidateResponse,
  CandidatesResponse,
} from './types'; 