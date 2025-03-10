import { Skill } from '../models/Skill';

export interface ISkillRepository {
  findAll(): Promise<Skill[]>;
  findById(id: number): Promise<Skill | null>;
  findByName(name: string): Promise<Skill | null>;
  findByCategory(category: string): Promise<Skill[]>;
  findByCandidateId(candidateId: number): Promise<Skill[]>;
  save(skill: Skill): Promise<Skill>;
  update(skill: Skill): Promise<Skill>;
  delete(id: number): Promise<boolean>;
  addToCandidateSkills(candidateId: number, skillId: number, level: string): Promise<void>;
  removeFromCandidateSkills(candidateId: number, skillId: number): Promise<void>;
} 