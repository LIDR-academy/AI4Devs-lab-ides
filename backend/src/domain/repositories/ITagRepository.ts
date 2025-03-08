import { Tag } from '../models/Tag';

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findByCandidateId(candidateId: number): Promise<Tag[]>;
  save(tag: Tag): Promise<Tag>;
  update(tag: Tag): Promise<Tag>;
  delete(id: number): Promise<boolean>;
  addToCandidateTags(candidateId: number, tagId: number): Promise<void>;
  removeFromCandidateTags(candidateId: number, tagId: number): Promise<void>;
} 