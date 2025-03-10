# Arquitectura para Gestión de Candidatos

## Introducción

Este documento describe la arquitectura diseñada para implementar la funcionalidad de añadir candidatos al Sistema de Seguimiento de Talento (LTI). La arquitectura sigue los principios SOLID, garantizando escalabilidad, seguridad y robustez.

## Estructura de Datos

### Modelo de Candidato

El modelo de datos para los candidatos se implementará en Prisma ORM con la siguiente estructura:

```prisma
model Candidate {
  id              Int       @id @default(autoincrement())
  firstName       String    // Nombre (obligatorio)
  lastName        String    // Apellido (obligatorio)
  email           String    @unique // Correo electrónico (obligatorio, único)
  phone           String?   // Teléfono (opcional)
  address         String?   // Dirección (opcional)
  education       String?   // Educación (opcional)
  workExperience  String?   // Experiencia laboral (opcional)
  cvUrl           String?   // URL del CV almacenado
  cvFileName      String?   // Nombre original del archivo
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### Justificación de la Estructura

- **Campos obligatorios**: `firstName`, `lastName` y `email` son campos obligatorios según los requisitos.
- **Campo único**: `email` se define como único para evitar duplicados.
- **Campos opcionales**: Los demás campos son opcionales y pueden ser nulos.
- **Campos para documentos**: `cvUrl` y `cvFileName` almacenan la información del CV cargado.
- **Campos de auditoría**: `createdAt` y `updatedAt` para seguimiento de cambios.

## Arquitectura del Sistema

### Arquitectura en Capas

La implementación seguirá una arquitectura en capas para separar responsabilidades:

1. **Capa de Presentación (Controllers)**
   - Maneja las peticiones HTTP
   - Valida datos de entrada básicos
   - Delega la lógica de negocio a la capa de servicios

2. **Capa de Servicios**
   - Implementa la lógica de negocio
   - Coordina operaciones entre repositorios
   - Maneja validaciones complejas

3. **Capa de Repositorios**
   - Interactúa con la base de datos a través de Prisma ORM
   - Encapsula operaciones CRUD
   - Implementa consultas específicas

4. **Capa de Infraestructura**
   - Gestiona la conexión a la base de datos
   - Proporciona servicios de almacenamiento de archivos
   - Implementa funcionalidades transversales (logging, seguridad)

### Diagrama de Componentes

```
+------------------------------------------+
|                                          |
|              Capa de Presentación        |
|         (Controllers - API Endpoints)    |
|                                          |
+------------------------------------------+
                    |
                    v
+------------------------------------------+
|                                          |
|              Capa de Servicios           |
|         (Lógica de Negocio)              |
|                                          |
+------------------------------------------+
                    |
                    v
+------------------------------------------+
|                                          |
|              Capa de Acceso a Datos      |
|         (Prisma ORM - Repositories)      |
|                                          |
+------------------------------------------+
                    |
                    v
+------------------------------------------+
|                                          |
|              Base de Datos PostgreSQL    |
|         (Docker Container)               |
|                                          |
+------------------------------------------+
```

## Flujo de Datos

### Diagrama de Flujo para Añadir Candidato

```
+------------------+                +------------------+                +------------------+
|                  |  1. Formulario |                  |  4. Petición   |                  |
|    Usuario       +---------------->    Frontend      +---------------->    Backend       |
|                  |                |                  |     POST       |                  |
+------------------+                +------------------+                +------------------+
                                     |            ^                      |            ^
                                     |            |                      |            |
                                     |            |                      |            |
                                     |            |                      v            |
                                     |            |                +------------------+
                                     |            |                |                  |
                                     |            |                |   Validación     |
                                     |            |                |                  |
                                     |            |                +------------------+
                                     |            |                      |            ^
                                     |            |                      v            |
                                     |            |                +------------------+
                                     |            |                |                  |
                                     |            |                |   Base de Datos  |
                                     v            |                |   PostgreSQL     |
                                +------------------+               |                  |
                                |                  |               +------------------+
                                |   Validación     |                      |            ^
                                |   Frontend       |                      v            |
                                |                  |                +------------------+
                                +------------------+               |                  |
                                     |            ^                |  Almacenamiento  |
                                     v            |                |  de Documentos   |
                                +------------------+               |                  |
                                |                  |               +------------------+
                                |  Preparación de  |
                                |  Documentos      |
                                |                  |
                                +------------------+
```

### Descripción del Flujo

1. **Frontend - Captura de Datos**:
   - El usuario completa el formulario con los datos del candidato
   - Se selecciona el CV para cargar (PDF/DOCX)
   - Se realizan validaciones en tiempo real (formato de email, campos obligatorios)

2. **Frontend - Preparación de Datos**:
   - Se prepara el objeto de datos del candidato
   - Se prepara el archivo para envío (FormData)

3. **Backend - Recepción y Validación**:
   - Endpoint recibe la petición POST con datos y archivo
   - Se validan todos los datos recibidos
   - Se sanitizan los inputs para prevenir inyecciones

4. **Backend - Almacenamiento de Documentos**:
   - Se valida el tipo y tamaño del archivo
   - Se almacena el archivo en el sistema de archivos local
   - Se genera una URL para acceder al documento

5. **Backend - Almacenamiento de Datos**:
   - Se crea el registro del candidato en la base de datos
   - Se almacena la referencia al documento (URL)

6. **Backend - Respuesta**:
   - Se envía respuesta de éxito o error al frontend

7. **Frontend - Feedback al Usuario**:
   - Se muestra mensaje de confirmación o error
   - Se redirige o se limpia el formulario según corresponda

## Estructura de Directorios

### Backend

```
backend/
├── src/
│   ├── controllers/
│   │   └── candidateController.ts
│   ├── services/
│   │   ├── candidateService.ts
│   │   └── fileService.ts
│   ├── repositories/
│   │   └── candidateRepository.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── fileUpload.ts
│   ├── routes/
│   │   └── candidateRoutes.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   └── fileHelpers.ts
│   ├── config/
│   │   └── database.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── uploads/
    └── cv/
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── candidates/
│   │   │   ├── CandidateForm.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── FormField.tsx
│   │   └── common/
│   │       ├── Alert.tsx
│   │       └── Button.tsx
│   ├── services/
│   │   └── api.ts
│   ├── hooks/
│   │   ├── useForm.ts
│   │   └── useFileUpload.ts
│   ├── utils/
│   │   └── validators.ts
│   ├── pages/
│   │   └── AddCandidate.tsx
│   └── App.tsx
```

## Contratos de API

### Crear Candidato

- **Endpoint**: `POST /api/candidates`
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```json
  {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "email": "string (required, valid email)",
    "phone": "string (optional)",
    "address": "string (optional)",
    "education": "string (optional)",
    "workExperience": "string (optional)",
    "cv": "file (optional, PDF/DOCX, max 5MB)"
  }
  ```
- **Respuesta Exitosa (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string | null",
      "address": "string | null",
      "education": "string | null",
      "workExperience": "string | null",
      "cvUrl": "string | null",
      "cvFileName": "string | null",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  }
  ```
- **Respuesta de Error (400 Bad Request)**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Error de validación",
      "details": {
        "field": "mensaje específico"
      }
    }
  }
  ```

## Estándares de Seguridad

### Validación y Sanitización de Datos

- **Frontend**:
  - Validación en tiempo real de formato de email
  - Validación de campos obligatorios
  - Limitación de tamaño de archivos antes de envío

- **Backend**:
  - Validación completa de todos los campos
  - Sanitización de inputs para prevenir XSS
  - Validación de tipos MIME para archivos

### Seguridad de Archivos

- Validación de extensiones permitidas (solo .pdf, .docx)
- Generación de nombres de archivo aleatorios para evitar conflictos
- Limitación de tamaño máximo (5MB)
- Escaneo básico de contenido malicioso

### Seguridad de Base de Datos

- Uso de Prisma ORM para prevenir inyección SQL
- Validación de tipos de datos antes de inserción
- Índices adecuados para optimizar consultas

## Consideraciones para la Implementación

### Almacenamiento de Archivos

Inicialmente, los archivos se almacenarán en el sistema de archivos local en la carpeta `uploads/cv/`. Esta decisión se toma por simplicidad y rapidez de implementación, pero en un entorno de producción se recomienda migrar a un servicio de almacenamiento en la nube.

### Escalabilidad

La arquitectura está diseñada para permitir escalabilidad horizontal. La separación en capas permite modificar o reemplazar componentes sin afectar al resto del sistema.

### Mantenibilidad

Se aplican los principios SOLID para garantizar un código mantenible:
- **S**: Cada clase tiene una única responsabilidad
- **O**: El sistema está abierto a extensiones pero cerrado a modificaciones
- **L**: Se utilizan interfaces para permitir sustituciones
- **I**: Las interfaces están segregadas por funcionalidad
- **D**: Las dependencias se inyectan, no se crean dentro de las clases

### Integración con PostgreSQL

La conexión a la base de datos PostgreSQL se realizará a través de Prisma ORM, utilizando las credenciales especificadas en el archivo `.env`. La base de datos se ejecuta en un contenedor Docker según lo especificado en el README.md.

## Decisiones Arquitectónicas

### ADR 1: Uso de Prisma ORM

**Contexto**: Necesitamos un ORM para interactuar con la base de datos PostgreSQL.

**Decisión**: Utilizar Prisma ORM.

**Estado**: Aceptado.

**Consecuencias**:
- **Positivas**: Tipado fuerte, migraciones automáticas, consultas seguras.
- **Negativas**: Curva de aprendizaje, dependencia de una librería externa.

### ADR 2: Almacenamiento Local de Archivos

**Contexto**: Necesitamos almacenar los CVs de los candidatos.

**Decisión**: Utilizar el sistema de archivos local en la carpeta `uploads/cv/`.

**Estado**: Aceptado para desarrollo, pendiente de revisión para producción.

**Consecuencias**:
- **Positivas**: Simplicidad, rapidez de implementación.
- **Negativas**: No escalable, no redundante, limitado a un servidor.

### ADR 3: Arquitectura en Capas

**Contexto**: Necesitamos una arquitectura que separe responsabilidades.

**Decisión**: Implementar una arquitectura en capas (Controllers, Services, Repositories).

**Estado**: Aceptado.

**Consecuencias**:
- **Positivas**: Separación de responsabilidades, testabilidad, mantenibilidad.
- **Negativas**: Mayor complejidad inicial, más archivos. 