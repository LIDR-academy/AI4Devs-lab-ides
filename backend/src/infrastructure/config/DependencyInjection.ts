import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../domain/services/AuthService';
import { CandidateService } from '../../domain/services/CandidateService';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaCandidateRepository } from '../repositories/PrismaCandidateRepository';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { CreateCandidateUseCase } from '../../application/use-cases/candidate/CreateCandidateUseCase';
import { GetAllCandidatesUseCase } from '../../application/use-cases/candidate/GetAllCandidatesUseCase';
import { AuthController } from '../controllers/AuthController';
import { CandidateController } from '../controllers/CandidateController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { UploadMiddleware } from '../middlewares/UploadMiddleware';
import dotenv from 'dotenv';

dotenv.config();

export class DependencyInjection {
  private prisma: PrismaClient;
  private jwtSecret: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  getAuthService(): AuthService {
    const userRepository = new PrismaUserRepository(this.prisma);
    return new AuthService(userRepository, this.jwtSecret);
  }

  getCandidateService(): CandidateService {
    const candidateRepository = new PrismaCandidateRepository(this.prisma);
    return new CandidateService(candidateRepository);
  }

  getRegisterUseCase(): RegisterUseCase {
    return new RegisterUseCase(this.getAuthService());
  }

  getLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.getAuthService());
  }

  getCreateCandidateUseCase(): CreateCandidateUseCase {
    return new CreateCandidateUseCase(this.getCandidateService());
  }

  getGetAllCandidatesUseCase(): GetAllCandidatesUseCase {
    return new GetAllCandidatesUseCase(this.getCandidateService());
  }

  getAuthController(): AuthController {
    return new AuthController(this.getRegisterUseCase(), this.getLoginUseCase());
  }

  getCandidateController(): CandidateController {
    return new CandidateController(this.getCreateCandidateUseCase(), this.getGetAllCandidatesUseCase());
  }

  getAuthMiddleware(): AuthMiddleware {
    return new AuthMiddleware(this.getAuthService());
  }

  getUploadMiddleware(): UploadMiddleware {
    return new UploadMiddleware();
  }
} 