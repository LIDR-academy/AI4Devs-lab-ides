# ATS Backend - Sistema de Seguimiento de Candidatos

Este es el backend para un Sistema de Seguimiento de Candidatos (ATS - Applicant Tracking System) que permite gestionar candidatos para procesos de selección.

## Requisitos

- Node.js (v14 o superior)
- PostgreSQL
- npm

## Configuración del Entorno

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno en un archivo `.env`:

```
DB_PASSWORD=tu_contraseña
DB_USER=tu_usuario
DB_NAME=nombre_db
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
JWT_SECRET=tu_clave_secreta
```

4. Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
```

5. Genera el cliente de Prisma:

```bash
npx prisma generate
```

## Ejecución

Para desarrollo:

```bash
npm run dev
```

Para producción:

```bash
npm run start:prod
```

El servidor se ejecutará en `http://localhost:3010` por defecto.

## Documentación de la API

La documentación de la API está disponible en `http://localhost:3010/api-docs` cuando el servidor está en ejecución.

## Endpoints Disponibles

### Candidatos

#### Crear un Candidato

- **URL**: `/candidatos`
- **Método**: `POST`
- **Autenticación**: Requerida (Bearer Token)
- **Tipo de Contenido**: `multipart/form-data`
- **Parámetros del Cuerpo**:
  - `nombre` (string, requerido): Nombre del candidato
  - `apellido` (string, requerido): Apellido del candidato
  - `email` (string, requerido): Email del candidato (debe ser único)
  - `telefono` (string, opcional): Teléfono del candidato
  - `direccion` (string, opcional): Dirección del candidato
  - `educacion` (string, requerido): Educación del candidato
  - `experiencia` (string, requerido): Experiencia del candidato
  - `cv` (file, opcional): Archivo PDF o DOCX del CV del candidato (máx. 5MB)

- **Respuesta Exitosa**:
  - **Código**: 201 Created
  - **Contenido**:
    ```json
    {
      "success": true,
      "message": "Candidato creado exitosamente",
      "data": {
        "id": "uuid-del-candidato",
        "nombre": "Nombre",
        "apellido": "Apellido",
        "email": "email@ejemplo.com"
      }
    }
    ```

- **Respuestas de Error**:
  - **Código**: 400 Bad Request
    - Datos inválidos o incompletos
  - **Código**: 409 Conflict
    - Email ya registrado
  - **Código**: 401 Unauthorized
    - Token no proporcionado o inválido
  - **Código**: 500 Internal Server Error
    - Error interno del servidor

## Estructura del Proyecto

```
backend/
├── prisma/
│   └── schema.prisma       # Esquema de la base de datos
├── src/
│   ├── controllers/        # Controladores de la API
│   ├── middleware/         # Middleware (auth, validación, etc.)
│   ├── routes/             # Rutas de la API
│   ├── utils/              # Utilidades
│   └── index.ts            # Punto de entrada
├── uploads/                # Directorio para archivos subidos
│   └── cv/                 # CVs de candidatos
└── logs/                   # Logs de la aplicación
```

## Almacenamiento de Archivos

Los archivos de CV se almacenan en el directorio `uploads/cv/` con nombres únicos generados automáticamente. La ruta del archivo se guarda en la base de datos para su posterior recuperación.

## Seguridad

- Autenticación mediante JWT
- Validación y sanitización de datos de entrada
- Limitación de tamaño y tipo de archivos
- Encabezados de seguridad con Helmet
- Manejo de CORS

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
``` 