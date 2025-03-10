import { User, UserCreationParams } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;

  constructor(userRepository: UserRepository, jwtSecret: string) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  async register(userParams: UserCreationParams): Promise<User> {
    const hashedPassword = await bcrypt.hash(userParams.password, 10);
    const userWithHashedPassword = {
      ...userParams,
      password: hashedPassword
    };
    return this.userRepository.create(userWithHashedPassword);
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    return token;
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }
} 