import { AuthService } from '../../../domain/services/AuthService';

export class LoginUseCase {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async execute(email: string, password: string): Promise<string | null> {
    return this.authService.login(email, password);
  }
} 