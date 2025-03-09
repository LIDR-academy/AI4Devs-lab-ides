# Sistema de Gestión de Candidatos - Backend

Este proyecto implementa el backend para un sistema de gestión de candidatos (ATS) con funcionalidades para la carga y gestión de documentos.

## Características

- **Autenticación y Autorización**: Sistema completo de autenticación con JWT y control de acceso basado en roles.
- **Gestión de Candidatos**: CRUD completo para candidatos con validación de datos.
- **Gestión de Documentos**: Carga, descarga y gestión de documentos con encriptación opcional.
- **Seguridad**: Implementación de mejores prácticas de seguridad (OWASP).
- **Documentación API**: Documentación completa con Swagger.
- **Validación de Datos**: Validación robusta con express-validator y Zod.
- **Manejo de Errores**: Sistema centralizado de manejo de errores.
- **Transacciones**: Soporte para transacciones en operaciones críticas.

## Estructura del Proyecto

```
backend/
├── prisma/              # Esquema y migraciones de Prisma
├── src/
│   ├── config/          # Configuración de la aplicación
│   ├── features/        # Características organizadas por dominio
│   │   ├── auth/        # Autenticación
│   │   ├── candidates/  # Gestión de candidatos
│   │   └── users/       # Gestión de usuarios
│   ├── middlewares/     # Middlewares de Express
│   ├── routes/          # Configuración de rutas
│   ├── types/           # Tipos y interfaces
│   ├── utils/           # Utilidades
│   └── index.ts         # Punto de entrada
├── uploads/             # Directorio para archivos subidos
└── tests/               # Pruebas
```

## Implementación de Carga de Documentos

La funcionalidad de carga de documentos incluye:

1. **Validación de Archivos**: Verificación de tipos y tamaños permitidos.
2. **Encriptación**: Encriptación opcional de documentos sensibles.
3. **Almacenamiento Seguro**: Generación de nombres únicos y rutas seguras.
4. **Control de Acceso**: Verificación de permisos para acceder a documentos.
5. **Descarga Segura**: Opciones para descargar documentos con o sin desencriptación.

## Requisitos

- Node.js 16+
- PostgreSQL
- npm o yarn

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
3. Configurar variables de entorno (crear archivo `.env` basado en `.env.example`)
4. Ejecutar migraciones de Prisma:
   ```
   npx prisma migrate dev
   ```
5. Iniciar el servidor:
   ```
   npm run dev
   ```

## API Endpoints

La documentación completa de la API está disponible en `/api-docs` cuando el servidor está en ejecución.

### Principales Endpoints

- **Autenticación**:
  - `POST /api/auth/login`: Iniciar sesión
  - `POST /api/auth/logout`: Cerrar sesión

- **Candidatos**:
  - `GET /api/candidates`: Listar candidatos
  - `POST /api/candidates`: Crear candidato
  - `GET /api/candidates/:id`: Obtener candidato
  - `PUT /api/candidates/:id`: Actualizar candidato
  - `DELETE /api/candidates/:id`: Eliminar candidato

- **Documentos**:
  - `POST /api/candidates/:candidateId/documents`: Subir documento
  - `GET /api/documents/:id`: Obtener documento
  - `DELETE /api/documents/:id`: Eliminar documento

## Seguridad

- Encriptación AES-256 para documentos sensibles
- Validación de tipos MIME para prevenir ataques
- Sanitización de nombres de archivo
- Control de acceso basado en roles
- Protección contra ataques comunes (XSS, CSRF, etc.)

## Licencia

MIT 