import { Request, Response } from 'express';
import prisma from '../index';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    return res.status(200).json({
      mensaje: 'Usuarios recuperados exitosamente',
      data: usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron recuperar los usuarios'
    });
  }
};

// Obtener un usuario por ID
export const obtenerUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'ID inválido',
        mensaje: 'El ID del usuario debe ser un número'
      });
    }

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        mensaje: 'El usuario solicitado no existe'
      });
    }

    return res.status(200).json({
      mensaje: 'Usuario recuperado exitosamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      mensaje: 'No se pudo recuperar el usuario'
    });
  }
}; 