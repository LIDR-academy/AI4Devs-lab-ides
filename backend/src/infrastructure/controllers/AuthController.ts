import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { body, validationResult } from 'express-validator';

export class AuthController {
  private registerUseCase: RegisterUseCase;
  private loginUseCase: LoginUseCase;

  constructor(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
  }

  registerValidationRules() {
    return [
      body('email').isEmail().withMessage('Email is invalid'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('name').notEmpty().withMessage('Name is required')
    ];
  }

  loginValidationRules() {
    return [
      body('email').isEmail().withMessage('Email is invalid'),
      body('password').notEmpty().withMessage('Password is required')
    ];
  }

  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
      const user = await this.registerUseCase.execute({ email, password, name });
      res.status(201).json(user);
    } catch (error: any) {
      console.error('Error registering user:', error);
      if (error.code === 'P2002') { // Prisma unique constraint failed
        res.status(409).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Error registering user' });
      }
    }
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const token = await this.loginUseCase.execute(email, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  }
} 