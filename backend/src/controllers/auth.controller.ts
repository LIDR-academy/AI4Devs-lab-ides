import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { formatResponse, formatError } from '../utils/response.utils';

// Define User interface with password
interface UserWithPassword {
  id: number;
  email: string;
  name: string | null;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login user with email and password
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(
        formatError('Email and password are required')
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists and password matches
    // In a real app, you would use bcrypt to compare hashed passwords
    if (!user || user.password !== password) {
      return res.status(401).json(
        formatError('Invalid credentials')
      );
    }

    // Generate token (simplified for test purposes)
    // In a real app, you would use JWT
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user as UserWithPassword;

    return res.status(200).json(
      formatResponse({
        token,
        user: userWithoutPassword
      }, 'Login successful')
    );
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(
      formatError('An error occurred during login')
    );
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    // In a real app, you would extract user ID from JWT token
    // For this example, we'll use the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        formatError('Authorization token is required')
      );
    }

    const token = authHeader.split(' ')[1];

    // Decode token (simplified for test purposes)
    // In a real app, you would verify JWT
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json(
        formatError('User not found')
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user as UserWithPassword;

    return res.status(200).json(
      formatResponse(userWithoutPassword, 'Profile retrieved successfully')
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json(
      formatError('An error occurred while retrieving profile')
    );
  }
};