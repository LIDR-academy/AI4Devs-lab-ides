import { User } from '../models/User';

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRefreshToken(token: string): Promise<User | null>;
  findByPasswordResetToken(token: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<boolean>;
} 