import { PrismaClient } from '@prisma/client';
import { User, Role, Permission } from '../../domain/models/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const userData = {
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      refreshToken: user.refreshToken,
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires,
      failedLoginAttempts: user.failedLoginAttempts,
      lockUntil: user.lockUntil,
    };

    const createdUser = await this.prisma.user.create({
      data: {
        ...userData,
        permissions: {
          connect: user.permissions.map(p => ({ id: p.id }))
        }
      },
      include: {
        permissions: true,
      },
    });

    return this.mapToUser(createdUser);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { permissions: true },
    });

    return user ? this.mapToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { permissions: true },
    });

    return user ? this.mapToUser(user) : null;
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { refreshToken: token },
      include: { permissions: true },
    });

    return user ? this.mapToUser(user) : null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: token },
      include: { permissions: true },
    });

    return user ? this.mapToUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { permissions: true },
    });

    return users.map(user => this.mapToUser(user));
  }

  async update(user: User): Promise<User> {
    if (!user.id) {
      throw new Error('User id is required for update');
    }

    const userData = {
      email: user.email,
      passwordHash: user.passwordHash,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      refreshToken: user.refreshToken,
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires,
      failedLoginAttempts: user.failedLoginAttempts,
      lockUntil: user.lockUntil,
    };

    // Actualizar permisos - primero desconectamos todos y luego conectamos los actuales
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        permissions: {
          set: [], // Desconectar todos los permisos
        },
      },
      include: {
        permissions: true,
      },
    });

    // Si hay permisos que conectar, lo hacemos en una segunda operación
    if (user.permissions.length > 0) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          permissions: {
            connect: user.permissions.map(p => ({ id: p.id })),
          },
        },
      });
    }

    // Obtenemos el usuario actualizado con todos sus permisos
    const refreshedUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { permissions: true },
    });

    return this.mapToUser(refreshedUser!);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToUser(prismaUser: any): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      passwordHash: prismaUser.passwordHash,
      name: prismaUser.name,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      role: prismaUser.role as Role,
      isActive: prismaUser.isActive,
      lastLogin: prismaUser.lastLogin,
      refreshToken: prismaUser.refreshToken,
      passwordResetToken: prismaUser.passwordResetToken,
      passwordResetExpires: prismaUser.passwordResetExpires,
      failedLoginAttempts: prismaUser.failedLoginAttempts,
      lockUntil: prismaUser.lockUntil,
      permissions: prismaUser.permissions as Permission[],
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
} 