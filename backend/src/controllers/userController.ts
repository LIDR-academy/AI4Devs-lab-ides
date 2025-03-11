import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, phone, address, education, experience } = req.body;
    const cv = req.file?.filename; // Guardar solo el nombre del archivo

    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        phone,
        address,
        education,
        experience,
        cv
      }
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const getEducationOptions = async (req: Request, res: Response) => {
  try {
    const educations = await prisma.user.findMany({
      distinct: ['education'],
      select: { education: true }
    });
    res.json(educations.map(e => e.education));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching education options' });
  }
};

export const getExperienceOptions = async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.user.findMany({
      distinct: ['experience'],
      select: { experience: true }
    });
    res.json(experiences.map(e => e.experience));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching experience options' });
  }
};
