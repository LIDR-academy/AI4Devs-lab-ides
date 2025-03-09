# API de Candidatos para Sistema ATS

Esta API permite gestionar candidatos en un sistema de seguimiento de solicitantes (ATS), incluyendo la gestión de sus datos personales, educación, experiencia laboral y documentos.

## Configuración

1. Asegúrate de tener la base de datos PostgreSQL en ejecución
2. Verifica que las migraciones de Prisma estén aplicadas:
   ```
   npx prisma migrate dev
   ```
3. Inicia el servidor:
   ```
   npm run dev
   ```

## Endpoints disponibles

### 1. Crear un nuevo candidato

- **Método**: POST
- **Endpoint**: `/api/candidatos`
- **Cuerpo de la solicitud (JSON)**:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@email.com",
  "telefono": "+34912345678",
  "direccion": "Calle Ficticia 123, Ciudad",
  "educacion": [
    {
      "institucion": "Universidad de Madrid",
      "titulo": "Licenciado en Psicología",
      "fecha_inicio": "2015-09-01",
      "fecha_fin": "2019-06-30"
    }
  ],
  "experiencia_laboral": [
    {
      "empresa": "Empresa XYZ",
      "puesto": "Psicólogo Clínico",
      "fecha_inicio": "2020-01-01",
      "fecha_fin": "2023-01-01",
      "descripcion": "Atención a pacientes, diagnóstico y seguimiento."
    }
  ]
}
```

- **Respuesta exitosa (201 - Created)**:

```json
{
  "message": "Candidato añadido exitosamente.",
  "id_candidato": 12345
}
```

### 2. Subir CV de un candidato

- **Método**: POST
- **Endpoint**: `/api/candidatos/{id_candidato}/documentos`
- **Cuerpo de la solicitud**: Formulario multipart/form-data con un campo `archivo` que contiene el archivo PDF o DOCX
- **Respuesta exitosa (200 - OK)**:

```json
{
  "message": "CV cargado exitosamente.",
  "nombre_archivo": "CV_Juan_Perez.pdf",
  "ruta_archivo": "/uploads/cv/CV_12345_1620000000000.pdf"
}
```

### 3. Obtener candidato por ID

- **Método**: GET
- **Endpoint**: `/api/candidatos/{id_candidato}`
- **Respuesta exitosa (200 - OK)**:

```json
{
  "id": 12345,
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@email.com",
  "telefono": "+34912345678",
  "direccion": "Calle Ficticia 123, Ciudad",
  "educacion": [
    {
      "institucion": "Universidad de Madrid",
      "titulo": "Licenciado en Psicología",
      "fecha_inicio": "2015-09-01",
      "fecha_fin": "2019-06-30"
    }
  ],
  "experiencia_laboral": [
    {
      "empresa": "Empresa XYZ",
      "puesto": "Psicólogo Clínico",
      "fecha_inicio": "2020-01-01",
      "fecha_fin": "2023-01-01",
      "descripcion": "Atención a pacientes, diagnóstico y seguimiento."
    }
  ],
  "documentos": [
    {
      "tipo_documento": "CV",
      "nombre_archivo": "CV_Juan_Perez.pdf",
      "ruta_archivo": "/uploads/cv/CV_12345_1620000000000.pdf"
    }
  ]
}
```

## Validaciones

- Los campos `nombre`, `apellido`, `email` y `telefono` son obligatorios
- El correo electrónico debe ser único en la base de datos
- Las fechas deben tener un formato correcto (YYYY-MM-DD)
- Para la carga de CV, solo se permiten archivos PDF o DOCX con un tamaño máximo de 5MB

## Manejo de errores

La API devuelve los siguientes códigos de error:

- **400 - Bad Request**: Cuando los datos enviados son inválidos o incompletos
- **404 - Not Found**: Cuando no se encuentra un candidato con el ID especificado
- **500 - Internal Server Error**: Cuando se produce un error en el servidor

## Ejemplos de uso

Puedes encontrar ejemplos de peticiones HTTP en el archivo `src/tests/candidato.http`. 