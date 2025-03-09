# Backend - Sistema de Seguimiento de Talento LTI

Este directorio contiene el código del backend para el Sistema de Seguimiento de Talento LTI, desarrollado con Express, TypeScript y Prisma ORM.

## Estructura del Proyecto

```
backend/
├── prisma/             # Esquema de Prisma y migraciones
├── src/                # Código fuente
│   ├── controllers/    # Controladores para manejar las solicitudes HTTP
│   ├── middlewares/    # Middlewares para procesamiento de solicitudes
│   ├── routes/         # Definición de rutas de la API
│   ├── services/       # Lógica de negocio y operaciones de base de datos
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades y funciones auxiliares
│   └── index.ts        # Punto de entrada
├── uploads/            # Directorio para almacenar archivos subidos (CVs)
├── .env                # Variables de entorno
├── package.json        # Dependencias y scripts
└── tsconfig.json       # Configuración de TypeScript
```

## Características Principales

### API RESTful
- Endpoints para crear, listar y obtener candidatos
- Respuestas estandarizadas con códigos HTTP apropiados
- Estructura modular y escalable

### Validación de Datos
- Validación robusta de datos de entrada con Zod
- Validación de formatos específicos (email, teléfono)
- Validación de fechas para asegurar coherencia temporal
- Manejo de fechas opcionales para educación y experiencia en curso

### Seguridad
- Cifrado de datos sensibles (email, teléfono)
- Almacenamiento seguro de archivos con nombres aleatorios
- Validación de tipos de archivo para prevenir cargas maliciosas
- Protección contra inyecciones SQL y otros ataques

### Manejo de Errores
- Middleware centralizado para el manejo de errores
- Respuestas de error estandarizadas
- Registro de errores para análisis posterior
- Mensajes de error claros y útiles

### Almacenamiento de Archivos
- Gestión segura de archivos CV
- Validación de tipos de archivo (PDF, DOCX)
- Generación de nombres de archivo aleatorios
- Restricciones de acceso a archivos

## Tecnologías Utilizadas

- **Express**: Framework web para Node.js
- **TypeScript**: Superset tipado de JavaScript
- **Prisma**: ORM para interactuar con la base de datos
- **PostgreSQL**: Base de datos relacional
- **Zod**: Validación de esquemas
- **Multer**: Middleware para manejo de archivos
- **Crypto**: Biblioteca para cifrado de datos

## Últimas Actualizaciones

- **Fechas opcionales**: Soporte para fechas de fin opcionales en educación y experiencia
- **Cifrado de datos**: Implementación de cifrado para datos sensibles
- **Mejora en validaciones**: Validación más robusta para todos los campos
- **Seguridad de archivos**: Mejoras en el almacenamiento seguro de CVs
- **Manejo de errores**: Sistema mejorado de manejo y registro de errores

## Instalación y Ejecución

1. Instala las dependencias:
```sh
npm install
```

2. Configura las variables de entorno:
   - Crea un archivo `.env` con las siguientes variables:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/LTIdb?schema=public"
   PORT=3010
   ENCRYPTION_KEY="tu-clave-de-cifrado-segura-de-32-caracteres"
   ```

3. Aplica el esquema de Prisma a la base de datos:
```sh
npx prisma db push
```

4. Inicia el servidor en modo desarrollo:
```sh
npm run dev
```

5. Para construir la versión de producción:
```sh
npm run build
```

6. Para ejecutar la versión de producción:
```sh
npm start
```

## Endpoints de la API

### Candidatos

- `POST /api/candidates`: Crear un nuevo candidato
  - Cuerpo: FormData con los campos del candidato y el archivo CV
  - Respuesta: Objeto candidato creado

- `GET /api/candidates`: Obtener todos los candidatos
  - Respuesta: Array de objetos candidato

- `GET /api/candidates/:id`: Obtener un candidato por ID
  - Parámetros: ID del candidato
  - Respuesta: Objeto candidato

## Base de Datos

El proyecto utiliza PostgreSQL como base de datos relacional. El esquema incluye:

- **Candidate**: Modelo principal para almacenar información de candidatos
  - Datos personales (nombre, apellido, email, teléfono, dirección)
  - Datos cifrados para información sensible
  - Educación y experiencia como campos JSON
  - Ruta al archivo CV

## Seguridad

El backend implementa varias medidas de seguridad:

1. **Cifrado de datos**: Los datos sensibles se cifran antes de almacenarse.
2. **Validación de entrada**: Todos los datos de entrada se validan rigurosamente.
3. **Almacenamiento seguro**: Los archivos se almacenan con nombres aleatorios y restricciones de acceso.
4. **Manejo seguro de errores**: Los mensajes de error no revelan información sensible.
5. **Sanitización de logs**: Los datos sensibles se sanitizan antes de registrarse.

## Notas para Desarrolladores

- Asegúrate de que la base de datos PostgreSQL esté en ejecución antes de iniciar el servidor.
- Los archivos CV se almacenan en el directorio `uploads/` con nombres aleatorios.
- Las validaciones de datos están definidas en `utils/validationSchemas.ts`.
- El cifrado de datos se implementa en `services/candidateService.ts`. 