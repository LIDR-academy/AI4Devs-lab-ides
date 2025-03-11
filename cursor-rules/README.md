# Reglas de Cursor para el Proyecto ATS

Este directorio contiene las reglas y prácticas de desarrollo para el Proyecto ATS, organizadas por áreas específicas.

## Estructura de Directorios

- **general/**: Reglas generales que aplican a todo el proyecto.
- **frontend/**: Reglas específicas para el desarrollo del frontend con React y TypeScript.
- **backend/**: Reglas específicas para el desarrollo del backend con Node.js y Express.
- **database/**: Reglas específicas para la gestión de la base de datos PostgreSQL.

## Uso

Cada directorio contiene un archivo `rules.md` que detalla las reglas y prácticas específicas para esa área del proyecto. Estas reglas deben seguirse durante el desarrollo para mantener la consistencia y calidad del código.

## Migración desde .cursorrules

Esta estructura reemplaza al archivo `.cursorrules` anterior, siguiendo las nuevas prácticas recomendadas para la organización de reglas en Cursor. La información se ha dividido en áreas específicas para facilitar su consulta y mantenimiento.

## Comandos Comunes

### Frontend
```bash
cd frontend
npm start
npm test
```

### Backend
```bash
cd backend
npm start
npm test
```

### Base de Datos
```bash
docker-compose up -d
npx prisma migrate dev
npx prisma generate
``` 