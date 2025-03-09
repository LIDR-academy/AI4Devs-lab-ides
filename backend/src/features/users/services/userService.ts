import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../../../utils/AppError';
import { ServiceResponse } from '../../auth/types';
import { PaginationParams } from '../../../middlewares/paginationMiddleware';
import { createPaginatedResponse, PaginatedResponse } from '../../../utils/paginationUtils';
import { withTransaction } from '../../../utils/transactionUtils';
import { hashPassword } from '../../auth/utils/authUtils';

/**
 * Servicio para manejar las operaciones de usuarios
 */
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Obtiene todos los usuarios con paginación y filtros
   */
  async getAllUsers(
    searchParams: any,
    pagination: PaginationParams
  ): Promise<ServiceResponse<PaginatedResponse<any>>> {
    try {
      const {
        query,
        role,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = searchParams;

      // Construir el filtro base
      const where: any = {};

      // Filtrar por rol si se proporciona
      if (role) {
        where.role = role;
      }

      // Filtrar por estado si se proporciona
      if (isActive !== undefined) {
        where.isActive = isActive === 'true' || isActive === true;
      }

      // Filtrar por búsqueda general si se proporciona
      if (query) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ];
      }

      // Construir el orden
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // Obtener los usuarios con paginación
      const users = await this.prisma.user.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        orderBy,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });

      // Obtener el total de usuarios para la paginación
      const total = await this.prisma.user.count({ where });

      // Crear la respuesta paginada
      const paginatedResponse = createPaginatedResponse(users, total, pagination);

      return {
        success: true,
        statusCode: 200,
        data: paginatedResponse,
      };
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al obtener los usuarios',
      };
    }
  }

  /**
   * Obtiene un usuario por su ID
   */
  async getUserById(id: number): Promise<ServiceResponse<any>> {
    try {
      // Asegurarse de que el id sea un entero
      const userId = parseInt(String(id), 10);
      
      if (isNaN(userId)) {
        return {
          success: false,
          statusCode: 400,
          error: 'ID de usuario inválido',
        };
      }
      
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });

      if (!user) {
        return {
          success: false,
          statusCode: 404,
          error: 'Usuario no encontrado',
        };
      }

      return {
        success: true,
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.error('Error en getUserById:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al obtener el usuario',
      };
    }
  }

  /**
   * Crea un nuevo usuario
   */
  async createUser(userData: any): Promise<ServiceResponse<any>> {
    try {
      // Verificar si ya existe un usuario con el mismo email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        return {
          success: false,
          statusCode: 409,
          error: 'Ya existe un usuario con este email',
        };
      }

      // Usar transacción para garantizar la atomicidad
      const user = await withTransaction(this.prisma, async (tx) => {
        // Hashear la contraseña
        const passwordHash = await hashPassword(userData.password);

        // Crear el usuario
        const newUser = await tx.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role || 'recruiter',
            passwordHash,
            isActive: userData.isActive !== undefined ? userData.isActive : true,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        // Registrar la creación del usuario en el log
        await tx.dataAccessLog.create({
          data: {
            action: 'create',
            description: `Usuario creado: ${newUser.email}`,
            userId: newUser.id,
          },
        });

        return newUser;
      });

      return {
        success: true,
        statusCode: 201,
        data: user,
      };
    } catch (error) {
      console.error('Error en createUser:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al crear el usuario',
      };
    }
  }

  /**
   * Actualiza un usuario existente
   */
  async updateUser(id: number, userData: any): Promise<ServiceResponse<any>> {
    try {
      // Verificar si el usuario existe
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return {
          success: false,
          statusCode: 404,
          error: 'Usuario no encontrado',
        };
      }

      // Verificar si se está intentando actualizar el email a uno que ya existe
      if (userData.email && userData.email !== existingUser.email) {
        const userWithEmail = await this.prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (userWithEmail) {
          return {
            success: false,
            statusCode: 409,
            error: 'Ya existe un usuario con este email',
          };
        }
      }

      // Usar transacción para garantizar la atomicidad
      const user = await withTransaction(this.prisma, async (tx) => {
        // Preparar los datos para la actualización
        const updateData: any = {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isActive: userData.isActive,
        };

        // Si se proporciona una nueva contraseña, hashearla
        if (userData.password) {
          updateData.passwordHash = await hashPassword(userData.password);
        }

        // Filtrar los campos undefined
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined) {
            delete updateData[key];
          }
        });

        // Actualizar el usuario
        const updatedUser = await tx.user.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        // Registrar la actualización del usuario en el log
        await tx.dataAccessLog.create({
          data: {
            action: 'update',
            description: `Usuario actualizado: ${updatedUser.email}`,
            userId: updatedUser.id,
          },
        });

        return updatedUser;
      });

      return {
        success: true,
        statusCode: 200,
        data: user,
      };
    } catch (error) {
      console.error('Error en updateUser:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al actualizar el usuario',
      };
    }
  }

  /**
   * Elimina un usuario
   */
  async deleteUser(id: number): Promise<ServiceResponse<any>> {
    try {
      // Verificar si el usuario existe
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return {
          success: false,
          statusCode: 404,
          error: 'Usuario no encontrado',
        };
      }

      // Usar transacción para garantizar la atomicidad
      await withTransaction(this.prisma, async (tx) => {
        // Registrar la eliminación del usuario en el log
        await tx.dataAccessLog.create({
          data: {
            action: 'delete',
            description: `Usuario eliminado: ${existingUser.email}`,
            userId: id,
          },
        });

        // Eliminar el usuario
        await tx.user.delete({
          where: { id },
        });
      });

      return {
        success: true,
        statusCode: 200,
        data: null,
      };
    } catch (error) {
      console.error('Error en deleteUser:', error);
      
      if (error instanceof AppError) {
        return {
          success: false,
          statusCode: error.statusCode,
          error: error.message,
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Error al eliminar el usuario',
      };
    }
  }
} 