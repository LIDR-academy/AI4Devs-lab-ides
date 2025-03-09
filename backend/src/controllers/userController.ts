import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';

// Obtener todos los usuarios
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(createError('Error al obtener usuarios', 500, 'USER_FETCH_ERROR', error));
  }
};

// Obtener un usuario por ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return next(createError('Usuario no encontrado', 404, 'USER_NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(createError('Error al obtener usuario', 500, 'USER_FETCH_ERROR', error));
  }
};

// Crear un nuevo usuario
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name } = req.body;

    // Validación básica
    if (!email) {
      return next(createError('El email es requerido', 400, 'VALIDATION_ERROR'));
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(createError('El email ya está registrado', 400, 'USER_ALREADY_EXISTS'));
    }

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    next(createError('Error al crear usuario', 500, 'USER_CREATE_ERROR', error));
  }
};

// Actualizar un usuario
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return next(createError('Usuario no encontrado', 404, 'USER_NOT_FOUND'));
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        email,
        name,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(createError('Error al actualizar usuario', 500, 'USER_UPDATE_ERROR', error));
  }
};

// Eliminar un usuario
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return next(createError('Usuario no encontrado', 404, 'USER_NOT_FOUND'));
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    next(createError('Error al eliminar usuario', 500, 'USER_DELETE_ERROR', error));
  }
}; 