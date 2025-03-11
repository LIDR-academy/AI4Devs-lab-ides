# Diseño del Modelo de Datos - Sistema ATS

## Entidades

El sistema está compuesto por cuatro entidades principales:

1. **Candidate**: Almacena la información básica del candidato
2. **Education**: Almacena cada entrada de educación del candidato
3. **WorkExperience**: Almacena cada entrada de experiencia laboral
4. **Document**: Almacena la información del CV del candidato

## Atributos y Tipos de Datos

### Candidate
```sql
- id: UUID (identificador único)
- firstName: VARCHAR(50) (nombre)
- lastName: VARCHAR(50) (apellido)
- email: VARCHAR(100) (correo electrónico)
- phone: VARCHAR(20) (teléfono)
- address: TEXT (dirección como campo libre)
- createdAt: TIMESTAMP (fecha de creación del registro)
- updatedAt: TIMESTAMP (fecha de última actualización)
```

### Education
```sql
- id: UUID (identificador único)
- candidateId: UUID (referencia al candidato)
- title: VARCHAR(100) (título obtenido)
- institution: VARCHAR(100) (institución educativa)
- startDate: DATE (fecha de inicio)
- endDate: DATE (fecha de fin)
- description: TEXT (descripción opcional)
- createdAt: TIMESTAMP (fecha de creación del registro)
- updatedAt: TIMESTAMP (fecha de última actualización)
```

### WorkExperience
```sql
- id: UUID (identificador único)
- candidateId: UUID (referencia al candidato)
- company: VARCHAR(100) (empresa)
- position: VARCHAR(100) (cargo)
- startDate: DATE (fecha de inicio)
- endDate: DATE (fecha de fin)
- responsibilities: TEXT (descripción opcional de responsabilidades)
- createdAt: TIMESTAMP (fecha de creación del registro)
- updatedAt: TIMESTAMP (fecha de última actualización)
```

### Document
```sql
- id: UUID (identificador único)
- candidateId: UUID (referencia al candidato)
- fileName: VARCHAR(255) (nombre del archivo)
- fileType: VARCHAR(10) (tipo de archivo: PDF/DOCX)
- fileSize: INTEGER (tamaño en bytes)
- filePath: VARCHAR(255) (ruta de almacenamiento)
- uploadedAt: TIMESTAMP (fecha de subida)
```

## Relaciones

1. **Candidate - Education**
   - Relación: Uno a Muchos (1:N)
   - Un candidato puede tener múltiples registros de educación
   - Cada registro de educación pertenece a un único candidato

2. **Candidate - WorkExperience**
   - Relación: Uno a Muchos (1:N)
   - Un candidato puede tener múltiples experiencias laborales
   - Cada experiencia laboral pertenece a un único candidato

3. **Candidate - Document**
   - Relación: Uno a Uno (1:1)
   - Un candidato puede tener un único documento (CV)
   - Cada documento pertenece a un único candidato

Diagrama de relaciones:
```
Candidate (1) ----< Education (N)
Candidate (1) ----< WorkExperience (N)
Candidate (1) ----| Document (1)
```

## Claves Primarias y Foráneas

### Candidate
```sql
Clave Primaria:
- id (UUID)
```

### Education
```sql
Clave Primaria:
- id (UUID)

Clave Foránea:
- candidateId (UUID) -> REFERENCES Candidate(id)
```

### WorkExperience
```sql
Clave Primaria:
- id (UUID)

Clave Foránea:
- candidateId (UUID) -> REFERENCES Candidate(id)
```

### Document
```sql
Clave Primaria:
- id (UUID)

Clave Foránea:
- candidateId (UUID) -> REFERENCES Candidate(id)
```

Comportamiento de claves foráneas:
- ON DELETE CASCADE
- ON UPDATE CASCADE

## Restricciones

### Candidate
```sql
- id: NOT NULL
- firstName: NOT NULL
- lastName: NOT NULL
- email: NOT NULL, UNIQUE
- phone: NOT NULL
- address: NOT NULL
- createdAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
- updatedAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
```

### Education
```sql
- id: NOT NULL
- candidateId: NOT NULL
- title: NOT NULL
- institution: NOT NULL
- startDate: NOT NULL
- endDate: NOT NULL
- description: NULL permitido
- createdAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
- updatedAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
CHECK (startDate <= endDate)
```

### WorkExperience
```sql
- id: NOT NULL
- candidateId: NOT NULL
- company: NOT NULL
- position: NOT NULL
- startDate: NOT NULL
- endDate: NOT NULL
- responsibilities: NULL permitido
- createdAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
- updatedAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
CHECK (startDate <= endDate)
```

### Document
```sql
- id: NOT NULL
- candidateId: NOT NULL, UNIQUE
- fileName: NOT NULL
- fileType: NOT NULL
- fileSize: NOT NULL
- filePath: NOT NULL, UNIQUE
- uploadedAt: NOT NULL, DEFAULT CURRENT_TIMESTAMP
CHECK (fileType IN ('PDF', 'DOCX'))
CHECK (fileSize <= 5242880) -- 5MB en bytes
``` 