import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../domain/services/AuthService';

export class AuthMiddleware {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.header('Authorization')?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
      }

      const decoded = this.authService.verifyToken(token);
      if (!decoded) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = decoded;
      next();
    };
  }
} 