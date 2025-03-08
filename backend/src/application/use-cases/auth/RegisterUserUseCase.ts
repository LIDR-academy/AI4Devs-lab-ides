import { User, Role } from '../../../domain/models/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { createOperationalError } from '../../../interfaces/http/middleware/errorHandlerMiddleware';
import { validatePassword } from '../../../utils/passwordValidator';

export interface RegisterUserDTO {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw createOperationalError(
        'Ya existe un usuario con este correo electrónico',
        409,
        'EMAIL_EXISTS'
      );
    }

    // Validar la complejidad de la contraseña
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      throw createOperationalError(
        passwordValidation.message || 'La contraseña no cumple con los requisitos de seguridad',
        400,
        'INVALID_PASSWORD'
      );
    }

    // Sanitizamos los datos de entrada para evitar campos no deseados
    const role = data.role || Role.RECRUITER; // Rol por defecto
    
    // Crear el usuario (el método estático se encarga de hashear la contraseña)
    const user = User.create({
      email: data.email,
      password: data.password,
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      role,
      isActive: true,
      permissions: [],
    });

    // Guardar el usuario en la base de datos
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }
} 