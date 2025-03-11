import { User, UserCreationParams } from '../entities/User';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: UserCreationParams): Promise<User>;
} 