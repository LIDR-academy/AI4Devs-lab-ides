# LTI - Sistema de Seguimiento de Talento

Este proyecto es una aplicación full-stack diseñada para la gestión de candidatos en procesos de selección. Implementa un sistema ATS (Applicant Tracking System) con un frontend en React y un backend en Express usando Prisma como ORM.

## 🚀 Características Principales

- Gestión completa de candidatos
- Almacenamiento y gestión de CV
- Registro de educación y experiencia laboral
- Validaciones de datos y documentos
- Interfaz de usuario moderna y responsive
- API RESTful documentada
- Autenticación mediante JWT

## 📁 Estructura del Proyecto

```
.
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── context/     # Context API
│   │   ├── hooks/       # Custom Hooks
│   │   ├── services/    # Servicios API
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utilidades
│   ├── public/          # Archivos estáticos
│   └── build/           # Build de producción
│
├── backend/            # Servidor Express
│   ├── src/
│   │   ├── controllers/ # Controladores
│   │   ├── routes/      # Rutas API
│   │   ├── services/    # Lógica de negocio
│   │   ├── utils/       # Utilidades
│   │   └── interfaces/  # TypeScript interfaces
│   └── prisma/         # Schema Prisma
│
└── docs/              # Documentación
    ├── mermaid/       # Diagramas del sistema
    ├── api-contract.yaml    # Especificación OpenAPI
    └── data-model-design.md # Diseño del modelo de datos
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- React
- TypeScript
- React Router
- Context API
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT Authentication

### Base de Datos
- PostgreSQL

### Herramientas de Desarrollo
- Docker
- ESLint
- Prettier

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- PostgreSQL (si no se usa Docker)
- npm o yarn

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd [nombre-del-repositorio]
```

2. **Configurar variables de entorno**
```bash
# Backend (.env)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydatabase"
JWT_SECRET="tu-secret-key"
PORT=3010

# Frontend (.env)
REACT_APP_API_URL="http://localhost:3010/api"
```

3. **Instalar dependencias**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

4. **Iniciar la base de datos**
```bash
docker-compose up -d
```

5. **Ejecutar migraciones de Prisma**
```bash
cd backend
npx prisma migrate dev
```

6. **Iniciar los servicios**
```bash
# Backend
cd backend
npm run dev

# Frontend (en otra terminal)
cd frontend
npm start
```

## 📚 Documentación

### Diagramas del Sistema
La carpeta `docs/mermaid` contiene los siguientes diagramas:
- `database-er.md` - Diagrama entidad-relación de la base de datos
- `backend-architecture.md` - Arquitectura del backend
- `frontend-architecture.md` - Arquitectura del frontend
- `create-candidate-sequence.md` - Flujo de creación de candidatos
- `frontend-components.md` - Estructura de componentes del frontend

Para visualizar los diagramas, puedes usar:
- VS Code con la extensión "Markdown Preview Mermaid Support"
- [Mermaid Live Editor](https://mermaid.live/)
- GitHub (renderizado automático)

### API
La documentación completa de la API se encuentra en:
- `docs/api-contract.yaml` - Especificación OpenAPI 3.0
- `docs/api-endpoints-design.md` - Descripción detallada de endpoints

### Modelo de Datos
El diseño completo del modelo de datos está documentado en:
- `docs/data-model-design.md`

## 🔒 Seguridad

- Autenticación mediante JWT
- Validación de tipos de archivo para CV (PDF/DOCX)
- Límite de tamaño de archivo (5MB)
- Sanitización de datos de entrada
- Protección contra ataques comunes (XSS, CSRF)

## 🧪 Testing

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

## 📝 Convenciones de Código

- TypeScript strict mode
- ESLint para linting
- Prettier para formateo
- Conventional Commits para mensajes de commit

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.