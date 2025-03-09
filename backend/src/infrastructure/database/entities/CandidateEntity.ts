import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Education } from '../../../domain/types/Education';
import { WorkExperience } from '../../../domain/types/WorkExperience';

@Entity('candidates')
export class CandidateEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column('jsonb', { nullable: true, default: [] })
  education!: Education[];

  @Column('jsonb', { nullable: true, default: [] })
  workExperience!: WorkExperience[];

  @Column({ nullable: true })
  cvUrl?: string;
} 