import { User, UserCreationParams } from '../../../domain/entities/User';
import { AuthService } from '../../../domain/services/AuthService';

export class RegisterUseCase {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async execute(userParams: UserCreationParams): Promise<User> {
    return this.authService.register(userParams);
  }
} 