# Actualización del Modelo de Datos para Candidatos - v2

## Introducción

Este documento describe los cambios necesarios en el modelo de datos para mejorar la gestión de candidatos en el Sistema de Seguimiento de Talento (LTI). Específicamente, se enfoca en la implementación de campos estructurados para educación y experiencia laboral, así como en la actualización de los campos obligatorios.

## Cambios Propuestos

### 1. Actualización de Campos Obligatorios

En la versión actual, solo los campos `firstName`, `lastName` y `email` son obligatorios. En la nueva versión, los siguientes campos también serán obligatorios:

- `phone`: Número de teléfono del candidato
- Al menos un registro de educación
- Al menos un registro de experiencia laboral
- `cv`: Archivo de currículum vitae

### 2. Nuevos Modelos para Educación y Experiencia Laboral

#### 2.1 Modelo de Educación

Se creará un nuevo modelo `Education` con la siguiente estructura:

```prisma
model Education {
  id          String    @id @default(uuid())
  institution String    // Nombre de la institución educativa
  degree      String    // Título obtenido
  fieldOfStudy String   // Campo de estudio
  startDate   DateTime  // Fecha de inicio
  endDate     DateTime? // Fecha de finalización (opcional para estudios en curso)
  description String?   @db.Text // Descripción adicional
  
  // Relación con el candidato
  candidateId String
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([candidateId])
}
```

#### 2.2 Modelo de Experiencia Laboral

Se creará un nuevo modelo `WorkExperience` con la siguiente estructura:

```prisma
model WorkExperience {
  id          String    @id @default(uuid())
  company     String    // Nombre de la empresa
  position    String    // Cargo o posición
  location    String?   // Ubicación
  startDate   DateTime  // Fecha de inicio
  endDate     DateTime? // Fecha de finalización (opcional para trabajos actuales)
  description String?   @db.Text // Descripción de responsabilidades y logros
  
  // Relación con el candidato
  candidateId String
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([candidateId])
}
```

### 3. Actualización del Modelo de Candidato

El modelo `Candidate` se actualizará para incluir las relaciones con los nuevos modelos y modificar los campos obligatorios:

```prisma
model Candidate {
  id            String    @id @default(uuid())
  firstName     String
  lastName      String
  email         String    @unique
  phone         String    // Ahora obligatorio
  address       String?
  cv            String    // Ahora obligatorio (URL del archivo)
  
  // Relaciones con los nuevos modelos
  education     Education[]
  workExperience WorkExperience[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## Estrategia de Migración

### 1. Preparación de Datos Existentes

Antes de aplicar los cambios, se debe realizar un análisis de los datos existentes:

1. Identificar candidatos sin número de teléfono
2. Identificar candidatos sin CV
3. Extraer información de educación y experiencia laboral de los campos de texto actuales

### 2. Creación de Migraciones

Se crearán las siguientes migraciones:

1. Migración para crear los nuevos modelos `Education` y `WorkExperience`
2. Migración para modificar el modelo `Candidate` y hacer obligatorios los campos correspondientes

### 3. Migración de Datos

Se desarrollará un script para:

1. Convertir los datos de educación y experiencia laboral de formato texto a los nuevos modelos estructurados
2. Contactar a los candidatos que no tengan la información obligatoria para completarla

## Impacto en la API

### 1. Nuevos Endpoints

Se crearán los siguientes endpoints:

- `GET /api/candidates/:id/education`: Obtener la educación de un candidato
- `POST /api/candidates/:id/education`: Añadir educación a un candidato
- `PUT /api/candidates/:id/education/:educationId`: Actualizar educación
- `DELETE /api/candidates/:id/education/:educationId`: Eliminar educación

- `GET /api/candidates/:id/work-experience`: Obtener la experiencia laboral de un candidato
- `POST /api/candidates/:id/work-experience`: Añadir experiencia laboral a un candidato
- `PUT /api/candidates/:id/work-experience/:experienceId`: Actualizar experiencia laboral
- `DELETE /api/candidates/:id/work-experience/:experienceId`: Eliminar experiencia laboral

### 2. Actualización de Endpoints Existentes

Los endpoints existentes se actualizarán para:

- Incluir la validación de campos obligatorios
- Manejar la creación y actualización de registros relacionados
- Devolver datos estructurados en las respuestas

## Implementación de Autocompletado

### 1. Tablas de Referencia

Se crearán tablas de referencia para facilitar el autocompletado:

```prisma
model Institution {
  id        String    @id @default(uuid())
  name      String    @unique
  type      String?   // Universidad, Instituto, etc.
  location  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Company {
  id        String    @id @default(uuid())
  name      String    @unique
  industry  String?
  location  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Degree {
  id        String    @id @default(uuid())
  name      String    @unique
  level     String?   // Grado, Máster, Doctorado, etc.
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model JobPosition {
  id        String    @id @default(uuid())
  title     String    @unique
  category  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### 2. Endpoints para Autocompletado

Se crearán los siguientes endpoints para el autocompletado:

- `GET /api/autocomplete/institutions?query=:query`: Buscar instituciones
- `GET /api/autocomplete/companies?query=:query`: Buscar empresas
- `GET /api/autocomplete/degrees?query=:query`: Buscar títulos académicos
- `GET /api/autocomplete/positions?query=:query`: Buscar posiciones laborales

### 3. Lógica de Autocompletado

La lógica de autocompletado incluirá:

1. Búsqueda por coincidencia parcial (LIKE)
2. Ordenación por frecuencia de uso
3. Limitación de resultados (top 10)
4. Almacenamiento automático de nuevos valores introducidos por los usuarios

## Consideraciones de Rendimiento

### 1. Indexación

Se crearán índices para optimizar las consultas:

- Índice en `Education.candidateId`
- Índice en `WorkExperience.candidateId`
- Índice en `Institution.name`
- Índice en `Company.name`
- Índice en `Degree.name`
- Índice en `JobPosition.title`

### 2. Paginación

Para candidatos con muchos registros de educación o experiencia laboral, se implementará paginación en los endpoints correspondientes.

### 3. Carga Diferida

Se implementará carga diferida (lazy loading) para los registros de educación y experiencia laboral en la interfaz de usuario.

## Impacto en la Interfaz de Usuario

### 1. Formulario de Candidato

El formulario de candidato se actualizará para:

- Marcar como obligatorios los campos de teléfono y CV
- Incluir secciones para añadir múltiples registros de educación y experiencia laboral
- Implementar componentes de autocompletado para instituciones, empresas, títulos y posiciones
- Permitir añadir, editar y eliminar registros de educación y experiencia laboral

### 2. Vista de Detalle de Candidato

La vista de detalle de candidato se actualizará para:

- Mostrar la educación y experiencia laboral en formato de línea de tiempo
- Permitir expandir/colapsar detalles
- Proporcionar acciones para editar o eliminar registros individuales

## Plan de Implementación

### Fase 1: Actualización del Modelo de Datos (3 días)

1. Crear los nuevos modelos en Prisma
2. Generar y aplicar migraciones
3. Implementar script de migración de datos

### Fase 2: Actualización de la API (4 días)

1. Implementar nuevos endpoints
2. Actualizar endpoints existentes
3. Implementar validaciones
4. Crear endpoints de autocompletado

### Fase 3: Actualización de la Interfaz de Usuario (5 días)

1. Diseñar componentes para educación y experiencia laboral
2. Implementar componentes de autocompletado
3. Actualizar formulario de candidato
4. Actualizar vista de detalle de candidato

### Fase 4: Pruebas y Ajustes (3 días)

1. Realizar pruebas de integración
2. Verificar migración de datos
3. Realizar pruebas de rendimiento
4. Ajustar según sea necesario

## Conclusión

La actualización propuesta del modelo de datos mejorará significativamente la gestión de candidatos al proporcionar:

1. Datos más estructurados y completos sobre educación y experiencia laboral
2. Mejor validación de datos obligatorios
3. Funcionalidad de autocompletado para mejorar la experiencia de usuario
4. Base para implementar búsquedas avanzadas en el futuro

Estos cambios sentarán las bases para futuras mejoras en el sistema, como la búsqueda y filtrado avanzados de candidatos basados en su educación y experiencia laboral. 