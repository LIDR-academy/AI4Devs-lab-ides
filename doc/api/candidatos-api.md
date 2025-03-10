# API de Candidatos

Esta documentación describe los endpoints disponibles para la gestión de candidatos en el Sistema de Seguimiento de Talento (LTI).

## Base URL

```
http://localhost:3010/api/candidates
```

## Endpoints

### Crear un Candidato

Crea un nuevo candidato en el sistema.

- **URL**: `/`
- **Método**: `POST`
- **Content-Type**: `multipart/form-data`

#### Parámetros de la Solicitud

| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| firstName | string | Sí | Nombre del candidato |
| lastName | string | Sí | Apellido del candidato |
| email | string | Sí | Correo electrónico del candidato (debe ser único) |
| phone | string | No | Número de teléfono del candidato |
| address | string | No | Dirección del candidato |
| education | string | No | Información educativa del candidato |
| workExperience | string | No | Experiencia laboral del candidato |
| cv | file | No | Archivo CV del candidato (PDF o DOCX, máx. 5MB) |

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34612345678",
    "address": "Calle Principal 123",
    "education": "Ingeniería Informática",
    "workExperience": "5 años como desarrollador",
    "cvUrl": "http://localhost:3010/uploads/cv/1620000000000-123456789.pdf",
    "cvFileName": "cv_juan_perez.pdf",
    "createdAt": "2023-05-03T12:00:00.000Z",
    "updatedAt": "2023-05-03T12:00:00.000Z"
  }
}
```

#### Respuestas de Error

**400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los campos nombre, apellido y email son obligatorios"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Ya existe un candidato con este email"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Tipo de archivo no permitido. Solo se aceptan PDF y DOCX."
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "El archivo excede el tamaño máximo permitido (5MB)."
  }
}
```

### Obtener Todos los Candidatos

Obtiene una lista de todos los candidatos.

- **URL**: `/`
- **Método**: `GET`

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "phone": "+34612345678",
      "address": "Calle Principal 123",
      "education": "Ingeniería Informática",
      "workExperience": "5 años como desarrollador",
      "cvUrl": "http://localhost:3010/uploads/cv/1620000000000-123456789.pdf",
      "cvFileName": "cv_juan_perez.pdf",
      "createdAt": "2023-05-03T12:00:00.000Z",
      "updatedAt": "2023-05-03T12:00:00.000Z"
    },
    {
      "id": 2,
      "firstName": "María",
      "lastName": "García",
      "email": "maria.garcia@example.com",
      "phone": "+34698765432",
      "address": "Avenida Secundaria 456",
      "education": "Máster en Marketing Digital",
      "workExperience": "3 años como especialista en marketing",
      "cvUrl": "http://localhost:3010/uploads/cv/1620000000001-987654321.pdf",
      "cvFileName": "cv_maria_garcia.pdf",
      "createdAt": "2023-05-04T10:30:00.000Z",
      "updatedAt": "2023-05-04T10:30:00.000Z"
    }
  ]
}
```

### Obtener un Candidato por ID

Obtiene los detalles de un candidato específico.

- **URL**: `/:id`
- **Método**: `GET`
- **Parámetros de URL**: `id` (número, ID del candidato)

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34612345678",
    "address": "Calle Principal 123",
    "education": "Ingeniería Informática",
    "workExperience": "5 años como desarrollador",
    "cvUrl": "http://localhost:3010/uploads/cv/1620000000000-123456789.pdf",
    "cvFileName": "cv_juan_perez.pdf",
    "createdAt": "2023-05-03T12:00:00.000Z",
    "updatedAt": "2023-05-03T12:00:00.000Z"
  }
}
```

#### Respuestas de Error

**400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ID de candidato inválido"
  }
}
```

**404 Not Found**

```json
{
  "success": false,
  "error": {
    "code": "CANDIDATE_NOT_FOUND",
    "message": "Candidato no encontrado"
  }
}
```

### Actualizar un Candidato

Actualiza los datos de un candidato existente.

- **URL**: `/:id`
- **Método**: `PUT`
- **Content-Type**: `multipart/form-data`
- **Parámetros de URL**: `id` (número, ID del candidato)

#### Parámetros de la Solicitud

| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| firstName | string | No | Nombre del candidato |
| lastName | string | No | Apellido del candidato |
| email | string | No | Correo electrónico del candidato (debe ser único) |
| phone | string | No | Número de teléfono del candidato |
| address | string | No | Dirección del candidato |
| education | string | No | Información educativa del candidato |
| workExperience | string | No | Experiencia laboral del candidato |
| cv | file | No | Archivo CV del candidato (PDF o DOCX, máx. 5MB) |

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan Carlos",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34612345678",
    "address": "Calle Principal 123",
    "education": "Ingeniería Informática y Máster en IA",
    "workExperience": "5 años como desarrollador",
    "cvUrl": "http://localhost:3010/uploads/cv/1620000000000-123456789.pdf",
    "cvFileName": "cv_juan_perez.pdf",
    "createdAt": "2023-05-03T12:00:00.000Z",
    "updatedAt": "2023-05-05T09:15:00.000Z"
  }
}
```

#### Respuestas de Error

**400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ID de candidato inválido"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Ya existe un candidato con este email"
  }
}
```

**404 Not Found**

```json
{
  "success": false,
  "error": {
    "code": "CANDIDATE_NOT_FOUND",
    "message": "Candidato no encontrado"
  }
}
```

### Eliminar un Candidato

Elimina un candidato del sistema.

- **URL**: `/:id`
- **Método**: `DELETE`
- **Parámetros de URL**: `id` (número, ID del candidato)

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Candidato eliminado correctamente"
}
```

#### Respuestas de Error

**400 Bad Request**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ID de candidato inválido"
  }
}
```

**404 Not Found**

```json
{
  "success": false,
  "error": {
    "code": "CANDIDATE_NOT_FOUND",
    "message": "Candidato no encontrado"
  }
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| VALIDATION_ERROR | Error de validación en los datos proporcionados |
| DUPLICATE_EMAIL | Ya existe un candidato con el email proporcionado |
| CANDIDATE_NOT_FOUND | No se encontró el candidato con el ID especificado |
| INVALID_FILE_TYPE | Tipo de archivo no permitido (solo PDF y DOCX) |
| FILE_TOO_LARGE | El archivo excede el tamaño máximo permitido (5MB) |
| FILE_UPLOAD_ERROR | Error al cargar el archivo |
| INTERNAL_SERVER_ERROR | Error interno del servidor | 