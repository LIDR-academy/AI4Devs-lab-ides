# [SPRINT-02]-[DB_SENIOR]-[Actualización del Modelo de Datos]

## Descripción
Actualizar el modelo de datos para soportar campos estructurados de educación y experiencia laboral, así como modificar los campos obligatorios según los nuevos requisitos. Esta actualización permitirá almacenar información más detallada sobre los candidatos y facilitará la implementación de funcionalidades de búsqueda avanzada en el futuro.

## Tareas Específicas

### 1. Diseño de Nuevos Modelos
- Diseñar el modelo `Education` con los siguientes campos:
  - ID, institución, título, campo de estudio
  - Fechas de inicio y fin
  - Descripción adicional
  - Relación con el candidato
- Diseñar el modelo `WorkExperience` con los siguientes campos:
  - ID, empresa, posición, ubicación
  - Fechas de inicio y fin
  - Descripción de responsabilidades y logros
  - Relación con el candidato
- Diseñar modelos de referencia para autocompletado:
  - `Institution` (instituciones educativas)
  - `Company` (empresas)
  - `Degree` (títulos académicos)
  - `JobPosition` (posiciones laborales)
- Documentar el diseño en `doc/architecture/modelo-datos-candidatos-v2.md`

### 2. Actualización del Modelo Existente
- Modificar el modelo `Candidate` para:
  - Establecer `phone` como campo obligatorio
  - Establecer `cv` como campo obligatorio
  - Añadir relaciones con los nuevos modelos (`Education` y `WorkExperience`)
- Asegurar que las relaciones estén correctamente definidas (cascada, índices, etc.)

### 3. Creación de Migraciones
- Generar migración para crear los nuevos modelos
- Generar migración para actualizar el modelo `Candidate`
- Asegurar que las migraciones son reversibles
- Probar las migraciones en un entorno de desarrollo

### 4. Desarrollo de Script de Migración de Datos
- Crear script para analizar datos existentes
- Implementar lógica para extraer información de educación y experiencia de campos de texto
- Desarrollar proceso para convertir datos a los nuevos modelos estructurados
- Incluir validación y manejo de errores

### 5. Planificación de Estrategia para Datos Incompletos
- Identificar candidatos sin número de teléfono o CV
- Desarrollar estrategia para contactar a estos candidatos
- Crear proceso para completar la información faltante
- Documentar el plan de acción

### 6. Documentación y Pruebas
- Actualizar la documentación del modelo de datos
- Crear ejemplos de consultas comunes con los nuevos modelos
- Desarrollar pruebas para verificar la integridad de los datos
- Documentar el proceso de migración para el equipo

## Recursos Necesarios
- Acceso al entorno de desarrollo con Prisma ORM
- Acceso a la base de datos de desarrollo
- Documentación actual del modelo de datos
- Herramientas para análisis y migración de datos

## Criterios de Aceptación
- Modelo de datos actualizado en Prisma con los nuevos modelos
- Migraciones creadas y probadas en entorno de desarrollo
- Script de migración de datos desarrollado y probado
- Documentación actualizada con el nuevo modelo
- Plan para manejar datos incompletos o faltantes
- Pruebas que verifican la integridad de los datos
- No hay pérdida de datos durante la migración

## Dependencias
- Ninguna

## Estimación
- 3 puntos de historia (3 días)

## Asignado a
- DB Senior

## Prioridad
- Alta 