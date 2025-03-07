import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUsers, getUserById, addUser, deleteUser, getEducationOptions, getExperienceOptions } from './userController';
import app from '../index'; // Importar app
import request from 'supertest';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const users = [{ id: 1, name: 'John Doe' }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      await getUsers(req as Request, res as Response);

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle errors', async () => {
      const error = new Error('Error fetching users');
      (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

      await getUsers(req as Request, res as Response);

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching users' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'John Doe' };
      req.params = { id: '1' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      await getUserById(req as Request, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should handle user not found', async () => {
      req.params = { id: '1' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await getUserById(req as Request, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors', async () => {
      const error = new Error('Error fetching user');
      req.params = { id: '1' };
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

      await getUserById(req as Request, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching user' });
    });
  });

  describe('addUser', () => {
    it('should add a new user', async () => {
      const newUser = { id: 1, name: 'John Doe' };
      req.body = { name: 'John', surname: 'Doe', email: 'john.doe@example.com', phone: '123456789', address: '123 Main St', education: 'BSc', experience: '5 years' };
      req.file = { filename: 'cv.pdf' } as Express.Multer.File;
      (prisma.user.create as jest.Mock).mockResolvedValue(newUser);

      await addUser(req as Request, res as Response);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          address: '123 Main St',
          education: 'BSc',
          experience: '5 years',
          cv: 'cv.pdf',
        },
      });
      expect(res.json).toHaveBeenCalledWith(newUser);
    });

    it('should handle errors', async () => {
      const error = new Error('Error adding user');
      req.body = { name: 'John', surname: 'Doe', email: 'john.doe@example.com', phone: '123456789', address: '123 Main St', education: 'BSc', experience: '5 years' };
      req.file = { filename: 'cv.pdf' } as Express.Multer.File;
      (prisma.user.create as jest.Mock).mockRejectedValue(error);

      await addUser(req as Request, res as Response);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          address: '123 Main St',
          education: 'BSc',
          experience: '5 years',
          cv: 'cv.pdf',
        },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error adding user' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      req.params = { id: '1' };
      (prisma.user.delete as jest.Mock).mockResolvedValue({});

      await deleteUser(req as Request, res as Response);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Error deleting user');
      req.params = { id: '1' };
      (prisma.user.delete as jest.Mock).mockRejectedValue(error);

      await deleteUser(req as Request, res as Response);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting user' });
    });
  });

  describe('getEducationOptions', () => {
    it('should return a list of education options', async () => {
      const educations = [{ education: 'BSc' }, { education: 'MSc' }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(educations);

      await getEducationOptions(req as Request, res as Response);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        distinct: ['education'],
        select: { education: true },
      });
      expect(res.json).toHaveBeenCalledWith(['BSc', 'MSc']);
    });

    it('should handle errors', async () => {
      const error = new Error('Error fetching education options');
      (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

      await getEducationOptions(req as Request, res as Response);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        distinct: ['education'],
        select: { education: true },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching education options' });
    });
  });

  describe('getExperienceOptions', () => {
    it('should return a list of experience options', async () => {
      const experiences = [{ experience: '5 years' }, { experience: '10 years' }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(experiences);

      await getExperienceOptions(req as Request, res as Response);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        distinct: ['experience'],
        select: { experience: true },
      });
      expect(res.json).toHaveBeenCalledWith(['5 years', '10 years']);
    });

    it('should handle errors', async () => {
      const error = new Error('Error fetching experience options');
      (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

      await getExperienceOptions(req as Request, res as Response);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        distinct: ['experience'],
        select: { experience: true },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching experience options' });
    });
  });
});
