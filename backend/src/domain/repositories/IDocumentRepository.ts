import { Document } from '../models/Document';

export interface IDocumentRepository {
  findAll(): Promise<Document[]>;
  findById(id: number): Promise<Document | null>;
  findByCandidateId(candidateId: number): Promise<Document[]>;
  findCandidateResume(candidateId: number): Promise<Document | null>;
  save(document: Document, candidateId: number): Promise<Document>;
  update(document: Document): Promise<Document>;
  delete(id: number): Promise<boolean>;
} 