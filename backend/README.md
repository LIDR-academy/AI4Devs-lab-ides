# Backend - LTI Sistema de Seguimiento de Talento

Este es el backend para el Sistema de Seguimiento de Talento de LTI, construido con Express.js, TypeScript y Prisma ORM.

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn
- PostgreSQL (puede ser ejecutado con Docker)

## Configuración

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env` (si existe)
   - Asegúrate de que la variable `DATABASE_URL` apunte a tu base de datos PostgreSQL

3. Ejecuta las migraciones de Prisma para configurar la base de datos:
```bash
npm run prisma:migrate
```

4. Genera el cliente Prisma:
```bash
npm run prisma:generate
```

## Crear usuario administrador

Para crear un usuario administrador con acceso a todas las funcionalidades, ejecuta:

```bash
npm run create:admin
```

Esto creará un usuario administrador con las siguientes credenciales:
- **Email**: admin@lti-talent.com
- **Contraseña**: 12345aA!
- **Nombre**: Admin
- **Rol**: ADMIN

## Ejecutar el servidor

### Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en http://localhost:3010 (o el puerto especificado en el archivo .env).

### Producción

```bash
npm run start:prod
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener información del usuario actual (requiere autenticación)

## Herramientas de desarrollo

- **Prisma Studio**: Para explorar y modificar los datos de la base de datos
  ```bash
  npm run prisma:studio
  ``` 