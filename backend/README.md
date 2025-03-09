# Backend del Sistema de Seguimiento de Candidatos (ATS)

Este backend proporciona una API RESTful para gestionar candidatos en un sistema de seguimiento de aplicantes (ATS).

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Multer (manejo de archivos)
- Joi (validación)
- Winston (logging)
- Swagger (documentación)

## Requisitos previos

- Node.js (v14 o superior)
- PostgreSQL (ejecutándose en Docker o localmente)
- npm o yarn

## Configuración

1. Clona el repositorio
2. Instala las dependencias:

```bash
cd backend
npm install
```

3. Configura las variables de entorno:

El archivo `.env` ya contiene la configuración básica para la base de datos. Si necesitas modificar alguna configuración, puedes editar este archivo.

Variables de entorno adicionales que puedes configurar:
- `PORT`: Puerto en el que se ejecutará el servidor (por defecto: 3010)
- `NODE_ENV`: Entorno de ejecución (development, production, test)
- `CORS_ORIGIN`: Origen permitido para CORS (por defecto: http://localhost:3000)

4. Genera los tipos de Prisma:

```bash
npx prisma generate
```

5. Aplica las migraciones de la base de datos:

```bash
npx prisma migrate dev --name init
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## Estructura del proyecto

```
backend/
├── prisma/              # Esquema y migraciones de Prisma
├── src/
│   ├── config/          # Configuraciones (multer, logger, etc.)
│   ├── controllers/     # Controladores
│   ├── middlewares/     # Middlewares (error handling, rate limiting, etc.)
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos y declaraciones
│   ├── utils/           # Utilidades (validación, etc.)
│   └── index.ts         # Punto de entrada
├── uploads/             # Directorio para archivos subidos
└── tests/               # Tests
```

## API Endpoints

### Candidatos

- `GET /api/candidates` - Obtener todos los candidatos (paginado)
- `POST /api/candidates` - Crear un nuevo candidato
- `GET /api/candidates/:id` - Obtener un candidato por ID

## Documentación

La documentación de la API está disponible en:

```
http://localhost:3010/api-docs
```

## Validaciones

El sistema valida:

- Campos obligatorios (nombre, apellido, email, teléfono)
- Formato de email
- Formato de teléfono
- Al menos una entrada de educación
- Formato de archivo CV (solo PDF y DOCX)
- Tamaño máximo de archivo (5MB)

## Manejo de errores

La API devuelve respuestas de error con el siguiente formato:

```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": {
    "campo1": ["Error 1", "Error 2"],
    "campo2": ["Error 1"]
  }
}
```

## Seguridad y Privacidad

### Medidas de seguridad implementadas

1. **Protección contra ataques comunes**:
   - Protección XSS (Cross-Site Scripting)
   - Protección CSRF (Cross-Site Request Forgery)
   - Protección contra inyección SQL (a través de Prisma ORM)
   - Protección contra ataques de fuerza bruta (rate limiting)

2. **Encabezados de seguridad**:
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-XSS-Protection
   - X-Frame-Options
   - Strict-Transport-Security
   - Referrer-Policy
   - Permissions-Policy

3. **Validación y sanitización de entrada**:
   - Validación de todos los datos de entrada con Joi
   - Sanitización de texto para prevenir XSS
   - Validación de tipos de archivo

4. **Limitación de tasa (Rate Limiting)**:
   - Límite general de solicitudes por IP
   - Límite específico para operaciones sensibles (creación de candidatos)

5. **Manejo seguro de archivos**:
   - Validación de tipos MIME
   - Generación de nombres de archivo aleatorios
   - Límite de tamaño de archivo

### Privacidad de datos

1. **Protección de datos sensibles**:
   - Enmascaramiento de emails en respuestas API (ej: joh***@example.com)
   - Enmascaramiento de números de teléfono (ej: 123****789)
   - Exclusión de rutas de archivos CV en respuestas API
   - Exclusión de direcciones completas en listados

2. **Acceso a datos**:
   - Implementación de principio de mínimo privilegio
   - Listados con información limitada
   - Detalles completos solo disponibles en endpoints específicos

3. **Almacenamiento de archivos**:
   - Los archivos CV se almacenan fuera de la base de datos
   - Nombres de archivo aleatorios para evitar acceso no autorizado
   - Eliminación de archivos en caso de error durante el proceso de creación

## Consideraciones para producción

Para un entorno de producción, se recomienda:

1. Implementar HTTPS
2. Configurar un sistema de autenticación y autorización
3. Implementar un sistema de logs centralizado
4. Configurar backups automáticos de la base de datos
5. Implementar monitoreo y alertas 