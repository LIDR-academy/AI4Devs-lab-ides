# Diseño de Endpoints de la API

## Consideraciones Generales de Seguridad (OWASP)

1. **Autenticación y Autorización**
   - Implementación de JWT con tiempo de expiración limitado
   - Validación de roles y permisos para cada endpoint
   - No exposición de información sensible en tokens
   - Implementación de rate limiting por IP y por usuario

2. **Protección contra Vulnerabilidades Comunes**
   - Validación estricta de entrada de datos
   - Sanitización de datos para prevenir XSS
   - Prevención de inyección SQL usando parámetros preparados
   - Implementación de CORS con orígenes específicos
   - Headers de seguridad (HSTS, CSP, X-Content-Type-Options, etc.)

3. **Manejo de Datos Sensibles**
   - Cifrado de datos sensibles en tránsito (HTTPS)
   - No exposición de IDs internos o información técnica en respuestas
   - Logs sanitizados sin información sensible
   - Mensajes de error genéricos en producción

## Endpoints

### 1. Crear Candidato
```http
POST /api/candidates

Security:
- Rate Limit: 10 requests/minuto
- Requiere autenticación: Sí
- Roles permitidos: RECRUITER
- Validación de entrada: Strict Schema Validation

Request headers:
- Content-Type: application/json
- Authorization: Bearer <token>

Request body:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}

Responses:
201 Created
{
  "id": "uuid",
  "message": "Candidato creado exitosamente"
}

400 Bad Request
{
  "error": "Validation error",
  "message": "Descripción genérica del error"
}

409 Conflict
{
  "error": "Duplicate entry",
  "message": "Ya existe un candidato con ese email"
}

429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "message": "Demasiadas solicitudes, intente más tarde"
}
```

### 2. Añadir Educación
```http
POST /api/candidates/{candidateId}/education

Security:
- Rate Limit: 20 requests/minuto
- Requiere autenticación: Sí
- Roles permitidos: RECRUITER
- Validación de ID: UUID validation

Request headers:
- Content-Type: application/json
- Authorization: Bearer <token>

Request body:
{
  "title": "string",
  "institution": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "description": "string"
}

Responses:
201 Created
{
  "id": "uuid",
  "message": "Educación añadida exitosamente"
}

400 Bad Request
{
  "error": "Validation error",
  "message": "Descripción genérica del error"
}

404 Not Found
{
  "error": "Not found",
  "message": "Candidato no encontrado"
}
```

### 3. Añadir Experiencia Laboral
```http
POST /api/candidates/{candidateId}/work-experience

Security:
- Rate Limit: 20 requests/minuto
- Requiere autenticación: Sí
- Roles permitidos: RECRUITER
- Validación de ID: UUID validation

Request headers:
- Content-Type: application/json
- Authorization: Bearer <token>

Request body:
{
  "company": "string",
  "position": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "responsibilities": "string"
}

Responses:
201 Created
{
  "id": "uuid",
  "message": "Experiencia laboral añadida exitosamente"
}

400 Bad Request
{
  "error": "Validation error",
  "message": "Descripción genérica del error"
}

404 Not Found
{
  "error": "Not found",
  "message": "Candidato no encontrado"
}
```

### 4. Subir Documento
```http
POST /api/candidates/{candidateId}/document

Security:
- Rate Limit: 5 requests/minuto
- Requiere autenticación: Sí
- Roles permitidos: RECRUITER
- Validación de archivo: Magic number check
- Escaneo de malware
- Tamaño máximo: 5MB

Request headers:
- Content-Type: multipart/form-data
- Authorization: Bearer <token>

Request body:
- file: Binary (PDF/DOCX)

Responses:
201 Created
{
  "id": "uuid",
  "message": "Documento subido exitosamente"
}

400 Bad Request
{
  "error": "Validation error",
  "message": "Formato de archivo inválido o tamaño excedido"
}

404 Not Found
{
  "error": "Not found",
  "message": "Candidato no encontrado"
}

409 Conflict
{
  "error": "Duplicate document",
  "message": "El candidato ya tiene un documento asociado"
}
```

## Medidas de Seguridad Adicionales

1. **Protección de Recursos**
   - Implementación de timeouts adecuados
   - Límites en el tamaño de payload
   - Validación de tipos de contenido
   - Prevención de ataques de denegación de servicio

2. **Monitoreo y Logging**
   - Registro de accesos y operaciones críticas
   - Monitoreo de patrones de uso anormales
   - Alertas de seguridad configuradas
   - Auditoría de operaciones sensibles

3. **Gestión de Errores**
   - No exposición de stacktraces
   - Logs detallados para debugging (solo en sistemas internos)
   - Mensajes de error genéricos para usuarios
   - Manejo centralizado de excepciones

4. **Validación de Datos**
   - Validación de tipos de datos
   - Sanitización de entradas
   - Validación de rangos y formatos
   - Prevención de inyección de datos maliciosos 