# API de Candidatos v2 - Sistema de Seguimiento de Talento (LTI)

Esta documentación describe la API actualizada para la gestión de candidatos en el Sistema de Seguimiento de Talento (LTI), incluyendo los nuevos endpoints para educación, experiencia laboral y autocompletado.

## Base URL

```
http://localhost:3010/api
```

## Endpoints de Candidatos

### Crear un candidato

**Endpoint:** `POST /candidates`

**Descripción:** Crea un nuevo candidato con su información básica, educación y experiencia laboral.

**Autenticación:** No requerida

**Parámetros de solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| firstName | string | Sí | Nombre del candidato |
| lastName | string | Sí | Apellido del candidato |
| email | string | Sí | Correo electrónico (único) |
| phone | string | Sí | Número de teléfono |
| address | string | No | Dirección |
| cv | file | Sí | Archivo de currículum vitae (PDF) |
| education | array | No | Lista de registros de educación |
| workExperience | array | No | Lista de registros de experiencia laboral |

**Formato de educación:**

```json
{
  "institution": "Universidad Complutense de Madrid",
  "degree": "Grado en Ingeniería Informática",
  "fieldOfStudy": "Informática",
  "startDate": "2015-09-01",
  "endDate": "2019-06-30",
  "description": "Especialización en Inteligencia Artificial"
}
```

**Formato de experiencia laboral:**

```json
{
  "company": "Accenture",
  "position": "Desarrollador Full Stack",
  "location": "Madrid",
  "startDate": "2019-07-01",
  "endDate": "2021-12-31",
  "description": "Desarrollo de aplicaciones web con React y Node.js"
}
```

**Respuesta exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Candidato creado exitosamente",
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34 612 345 678",
    "address": "Calle Mayor 123, Madrid",
    "cvUrl": "/uploads/1620000000000_cv.pdf",
    "cvFileName": "cv.pdf",
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T10:30:00.000Z",
    "education": [
      {
        "id": 1,
        "institution": "Universidad Complutense de Madrid",
        "degree": "Grado en Ingeniería Informática",
        "fieldOfStudy": "Informática",
        "startDate": "2015-09-01T00:00:00.000Z",
        "endDate": "2019-06-30T00:00:00.000Z",
        "description": "Especialización en Inteligencia Artificial",
        "candidateId": 1,
        "createdAt": "2023-05-03T10:30:00.000Z",
        "updatedAt": "2023-05-03T10:30:00.000Z"
      }
    ],
    "workExperience": [
      {
        "id": 1,
        "company": "Accenture",
        "position": "Desarrollador Full Stack",
        "location": "Madrid",
        "startDate": "2019-07-01T00:00:00.000Z",
        "endDate": "2021-12-31T00:00:00.000Z",
        "description": "Desarrollo de aplicaciones web con React y Node.js",
        "candidateId": 1,
        "createdAt": "2023-05-03T10:30:00.000Z",
        "updatedAt": "2023-05-03T10:30:00.000Z"
      }
    ]
  }
}
```

**Respuestas de error:**

- `400 Bad Request`: Datos inválidos o faltantes
- `409 Conflict`: Ya existe un candidato con ese email

### Obtener todos los candidatos

**Endpoint:** `GET /candidates`

**Descripción:** Obtiene la lista de todos los candidatos con su información básica, educación y experiencia laboral.

**Autenticación:** No requerida

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan.perez@example.com",
      "phone": "+34 612 345 678",
      "address": "Calle Mayor 123, Madrid",
      "cvUrl": "/uploads/1620000000000_cv.pdf",
      "cvFileName": "cv.pdf",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z",
      "education": [...],
      "workExperience": [...]
    },
    {
      "id": 2,
      "firstName": "María",
      "lastName": "García",
      "email": "maria.garcia@example.com",
      "phone": "+34 623 456 789",
      "address": "Avenida Diagonal 456, Barcelona",
      "cvUrl": "/uploads/1620000000001_cv.pdf",
      "cvFileName": "cv.pdf",
      "createdAt": "2023-05-03T11:30:00.000Z",
      "updatedAt": "2023-05-03T11:30:00.000Z",
      "education": [...],
      "workExperience": [...]
    }
  ]
}
```

### Obtener un candidato por ID

**Endpoint:** `GET /candidates/:id`

**Descripción:** Obtiene la información detallada de un candidato específico por su ID.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del candidato |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34 612 345 678",
    "address": "Calle Mayor 123, Madrid",
    "cvUrl": "/uploads/1620000000000_cv.pdf",
    "cvFileName": "cv.pdf",
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T10:30:00.000Z",
    "education": [...],
    "workExperience": [...]
  }
}
```

**Respuestas de error:**

- `400 Bad Request`: ID inválido
- `404 Not Found`: Candidato no encontrado

### Actualizar un candidato

**Endpoint:** `PUT /candidates/:id`

**Descripción:** Actualiza la información de un candidato existente.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del candidato |

**Parámetros de solicitud:** Mismos campos que en la creación, todos opcionales.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Candidato actualizado exitosamente",
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez Gómez",
    "email": "juan.perez@example.com",
    "phone": "+34 612 345 678",
    "address": "Calle Mayor 123, Madrid",
    "cvUrl": "/uploads/1620000000000_cv.pdf",
    "cvFileName": "cv.pdf",
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T12:30:00.000Z",
    "education": [...],
    "workExperience": [...]
  }
}
```

**Respuestas de error:**

- `400 Bad Request`: Datos inválidos
- `404 Not Found`: Candidato no encontrado
- `409 Conflict`: Ya existe otro candidato con ese email

### Eliminar un candidato

**Endpoint:** `DELETE /candidates/:id`

**Descripción:** Elimina un candidato existente.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del candidato |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Candidato eliminado exitosamente"
}
```

**Respuestas de error:**

- `400 Bad Request`: ID inválido
- `404 Not Found`: Candidato no encontrado

## Endpoints de Educación

### Obtener educación de un candidato

**Endpoint:** `GET /candidates/:candidateId/education`

**Descripción:** Obtiene todos los registros de educación de un candidato.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| candidateId | integer | ID del candidato |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution": "Universidad Complutense de Madrid",
      "degree": "Grado en Ingeniería Informática",
      "fieldOfStudy": "Informática",
      "startDate": "2015-09-01T00:00:00.000Z",
      "endDate": "2019-06-30T00:00:00.000Z",
      "description": "Especialización en Inteligencia Artificial",
      "candidateId": 1,
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    },
    {
      "id": 2,
      "institution": "Universidad Politécnica de Madrid",
      "degree": "Máster en Ciencia de Datos",
      "fieldOfStudy": "Ciencia de Datos",
      "startDate": "2019-09-01T00:00:00.000Z",
      "endDate": "2020-06-30T00:00:00.000Z",
      "description": "Especialización en Machine Learning",
      "candidateId": 1,
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    }
  ]
}
```

### Obtener un registro de educación por ID

**Endpoint:** `GET /education/:id`

**Descripción:** Obtiene un registro de educación específico por su ID.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del registro de educación |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution": "Universidad Complutense de Madrid",
    "degree": "Grado en Ingeniería Informática",
    "fieldOfStudy": "Informática",
    "startDate": "2015-09-01T00:00:00.000Z",
    "endDate": "2019-06-30T00:00:00.000Z",
    "description": "Especialización en Inteligencia Artificial",
    "candidateId": 1,
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T10:30:00.000Z"
  }
}
```

### Crear un registro de educación

**Endpoint:** `POST /candidates/:candidateId/education`

**Descripción:** Crea un nuevo registro de educación para un candidato.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| candidateId | integer | ID del candidato |

**Parámetros de solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| institution | string | Sí | Nombre de la institución educativa |
| degree | string | Sí | Título obtenido |
| fieldOfStudy | string | Sí | Campo de estudio |
| startDate | string | Sí | Fecha de inicio (formato ISO) |
| endDate | string | No | Fecha de finalización (formato ISO) |
| description | string | No | Descripción adicional |

**Respuesta exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Registro de educación creado exitosamente",
  "data": {
    "id": 3,
    "institution": "Universidad Autónoma de Barcelona",
    "degree": "Doctorado en Ciencias de la Computación",
    "fieldOfStudy": "Computación",
    "startDate": "2020-09-01T00:00:00.000Z",
    "endDate": null,
    "description": "Investigación en Inteligencia Artificial",
    "candidateId": 1,
    "createdAt": "2023-05-03T13:30:00.000Z",
    "updatedAt": "2023-05-03T13:30:00.000Z"
  }
}
```

### Actualizar un registro de educación

**Endpoint:** `PUT /education/:id`

**Descripción:** Actualiza un registro de educación existente.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del registro de educación |

**Parámetros de solicitud:** Mismos campos que en la creación, todos opcionales.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Registro de educación actualizado exitosamente",
  "data": {
    "id": 1,
    "institution": "Universidad Complutense de Madrid",
    "degree": "Grado en Ingeniería Informática",
    "fieldOfStudy": "Informática",
    "startDate": "2015-09-01T00:00:00.000Z",
    "endDate": "2019-07-15T00:00:00.000Z",
    "description": "Especialización en Inteligencia Artificial y Big Data",
    "candidateId": 1,
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T14:30:00.000Z"
  }
}
```

### Eliminar un registro de educación

**Endpoint:** `DELETE /education/:id`

**Descripción:** Elimina un registro de educación existente.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del registro de educación |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Registro de educación eliminado exitosamente"
}
```

## Endpoints de Experiencia Laboral

### Obtener experiencia laboral de un candidato

**Endpoint:** `GET /candidates/:candidateId/work-experience`

**Descripción:** Obtiene todos los registros de experiencia laboral de un candidato.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| candidateId | integer | ID del candidato |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company": "Accenture",
      "position": "Desarrollador Full Stack",
      "location": "Madrid",
      "startDate": "2019-07-01T00:00:00.000Z",
      "endDate": "2021-12-31T00:00:00.000Z",
      "description": "Desarrollo de aplicaciones web con React y Node.js",
      "candidateId": 1,
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    },
    {
      "id": 2,
      "company": "BBVA",
      "position": "Ingeniero de Software",
      "location": "Madrid",
      "startDate": "2022-01-01T00:00:00.000Z",
      "endDate": null,
      "description": "Desarrollo de aplicaciones financieras",
      "candidateId": 1,
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    }
  ]
}
```

### Obtener un registro de experiencia laboral por ID

**Endpoint:** `GET /work-experience/:id`

**Descripción:** Obtiene un registro de experiencia laboral específico por su ID.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del registro de experiencia laboral |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "company": "Accenture",
    "position": "Desarrollador Full Stack",
    "location": "Madrid",
    "startDate": "2019-07-01T00:00:00.000Z",
    "endDate": "2021-12-31T00:00:00.000Z",
    "description": "Desarrollo de aplicaciones web con React y Node.js",
    "candidateId": 1,
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T10:30:00.000Z"
  }
}
```

### Crear un registro de experiencia laboral

**Endpoint:** `POST /candidates/:candidateId/work-experience`

**Descripción:** Crea un nuevo registro de experiencia laboral para un candidato.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| candidateId | integer | ID del candidato |

**Parámetros de solicitud:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| company | string | Sí | Nombre de la empresa |
| position | string | Sí | Cargo o posición |
| location | string | No | Ubicación |
| startDate | string | Sí | Fecha de inicio (formato ISO) |
| endDate | string | No | Fecha de finalización (formato ISO) |
| description | string | No | Descripción de responsabilidades y logros |

**Respuesta exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Registro de experiencia laboral creado exitosamente",
  "data": {
    "id": 3,
    "company": "Telefónica",
    "position": "Arquitecto de Soluciones",
    "location": "Madrid",
    "startDate": "2022-06-01T00:00:00.000Z",
    "endDate": null,
    "description": "Diseño de arquitecturas de software",
    "candidateId": 1,
    "createdAt": "2023-05-03T15:30:00.000Z",
    "updatedAt": "2023-05-03T15:30:00.000Z"
  }
}
```

### Actualizar un registro de experiencia laboral

**Endpoint:** `PUT /work-experience/:id`

**Descripción:** Actualiza un registro de experiencia laboral existente.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del registro de experiencia laboral |

**Parámetros de solicitud:** Mismos campos que en la creación, todos opcionales.

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Registro de experiencia laboral actualizado exitosamente",
  "data": {
    "id": 1,
    "company": "Accenture",
    "position": "Desarrollador Full Stack Senior",
    "location": "Madrid",
    "startDate": "2019-07-01T00:00:00.000Z",
    "endDate": "2021-12-31T00:00:00.000Z",
    "description": "Desarrollo de aplicaciones web con React y Node.js. Liderazgo de equipo.",
    "candidateId": 1,
    "createdAt": "2023-05-03T10:30:00.000Z",
    "updatedAt": "2023-05-03T16:30:00.000Z"
  }
}
```

### Eliminar un registro de experiencia laboral

**Endpoint:** `DELETE /work-experience/:id`

**Descripción:** Elimina un registro de experiencia laboral existente.

**Autenticación:** No requerida

**Parámetros de ruta:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | integer | ID del registro de experiencia laboral |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Registro de experiencia laboral eliminado exitosamente"
}
```

## Endpoints de Autocompletado

### Buscar instituciones educativas

**Endpoint:** `GET /autocomplete/institutions`

**Descripción:** Busca instituciones educativas por nombre.

**Autenticación:** No requerida

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| query | string | No | Texto de búsqueda |
| limit | integer | No | Límite de resultados (por defecto: 10) |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Universidad Complutense de Madrid",
      "type": "Universidad",
      "location": "Madrid",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Universidad Politécnica de Madrid",
      "type": "Universidad",
      "location": "Madrid",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    }
  ]
}
```

### Buscar empresas

**Endpoint:** `GET /autocomplete/companies`

**Descripción:** Busca empresas por nombre.

**Autenticación:** No requerida

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| query | string | No | Texto de búsqueda |
| limit | integer | No | Límite de resultados (por defecto: 10) |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Accenture",
      "industry": "Consultoría",
      "location": "Madrid",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "BBVA",
      "industry": "Banca",
      "location": "Madrid",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    }
  ]
}
```

### Buscar títulos académicos

**Endpoint:** `GET /autocomplete/degrees`

**Descripción:** Busca títulos académicos por nombre.

**Autenticación:** No requerida

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| query | string | No | Texto de búsqueda |
| limit | integer | No | Límite de resultados (por defecto: 10) |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Grado en Ingeniería Informática",
      "level": "Grado",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Máster en Ciencia de Datos",
      "level": "Máster",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    }
  ]
}
```

### Buscar posiciones laborales

**Endpoint:** `GET /autocomplete/positions`

**Descripción:** Busca posiciones laborales por título.

**Autenticación:** No requerida

**Parámetros de consulta:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| query | string | No | Texto de búsqueda |
| limit | integer | No | Límite de resultados (por defecto: 10) |

**Respuesta exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Desarrollador Full Stack",
      "category": "Desarrollo",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Ingeniero de Software",
      "category": "Desarrollo",
      "createdAt": "2023-05-03T10:30:00.000Z",
      "updatedAt": "2023-05-03T10:30:00.000Z"
    }
  ]
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos o faltantes |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto con datos existentes |
| 500 | Internal Server Error - Error interno del servidor | 