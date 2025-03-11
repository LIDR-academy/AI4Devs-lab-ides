# Reglas de Desarrollo para Base de Datos

## Arquitectura
- Base de Datos PostgreSQL en contenedor Docker Compose
- Seguir los principios de Domain-Driven Design (DDD)

## Estándares de Código
- Usar TypeORM como ORM
- Implementar migraciones para cambios en DB
- Seguir convenciones de nombrado snake_case
- Documentar todas las tablas y relaciones

## Testing
- Tests de integración para operaciones de base de datos
- Cobertura mínima de tests: 80%

## Seguridad
- Encriptación de datos sensibles
- Manejo seguro de credenciales
- Implementar roles y permisos adecuados

## Documentación
- Documentación de esquema de base de datos
- Diagramas de entidad-relación
- Documentación de migraciones

## Comandos
```bash
# Comandos para gestionar la base de datos
docker-compose up -d # Iniciar la base de datos
npx prisma migrate dev # Ejecutar migraciones
npx prisma generate # Generar cliente Prisma
``` 