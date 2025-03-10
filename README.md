# LTI - Sistema de Seguimiento de Talento
Contexto del proyecto:

Estás trabajando en un proyecto de desarrollo de software para un sistema de gestión de talento (ATS). Un ATS (Applicant Tracking System) es un software diseñado para gestionar el proceso de reclutamiento y selección de personal de manera digital y eficiente, desde la publicación de ofertas  hasta la contratación, agilizando y optimizando el proceso.

## Architecture
 
This project follows Hexagonal Architecture and Domain-Driven Design (DDD) principles:

Bounded Contexts Identificados:

### 1. Job Posting (Publicación de Vacantes)

* Manejo de la creación, edición y publicación de ofertas en múltiples plataformas.
* Gestión de requisitos de las vacantes.
* Integración con portales de empleo externos.

### 2. Candidate Management (Gestión de Candidatos)

* Registro y administración de candidatos por un usuario reclutador.
* Almacenamiento de CVs y perfiles.
* Seguimiento del historial de interacciones con la empresa.

### 3. Application Tracking (Seguimiento de Candidaturas)

* Registro del estado de cada postulación en el proceso de selección.
* Movimientos entre etapas (screening, entrevistas, pruebas técnicas, etc.).
* Rechazos y contrataciones.

### 4. Communication & Notifications (Comunicación y Notificaciones)

* Envío de correos electrónicos y notificaciones a candidatos.
* Programación de entrevistas y coordinación con reclutadores.
* Automatización de respuestas en diferentes etapas del proceso.

### 5. Recruitment Analytics (Análisis y Reportes de Reclutamiento)

* Generación de métricas e informes sobre eficiencia del proceso.
* Análisis de fuentes de reclutamiento y desempeño de las publicaciones.
* Predicción de tiempos de contratación y embudos de conversión.

### 6. User Management & Permissions (Gestión de Usuarios y Permisos)

* Roles y accesos para reclutadores, gerentes de contratación y administradores.
* Seguridad y autenticación.
* Auditoría de acciones en el sistema.



## Stack de tecnologías

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

```
LTI - Sistema de Seguimiento de Talento
├── backend/                   # Contiene el código del lado del servidor escrito en Node.js.
│   ├── src/                   # Contiene el código fuente para el backend.
|   |   ├── index.ts           # El punto de entrada para el servidor backend.
|   |   ├── domain/
|   |   │   ├── entities/
|   |   │   │   └── Candidate.ts
|   |   │   ├── repositories/
|   |   │   │   └── ICandidateRepository.ts
|   |   │   └── services/
|   |   │       └── CandidateService.ts
|   |   ├── application/
|   |   │   ├── dtos/
|   |   │   │   └── CandidateDTO.ts
|   |   │   └── useCases/
|   |   │       └── CreateCandidateUseCase.ts
|   |   └── infrastructure/
|   |       ├── controllers/
|   |       │   └── CandidateController.ts
|   |       ├── repositories/
|   |       │   └── PrismaCandidateRepository.ts
|   |       ├── routes/
|   |       │   └── candidateRoutes.ts
|   |       └── middlewares/
|   |           ├── errorHandler.ts
|   |           ├── validateRequest.ts
|   |           └── fileUpload.ts
│   ├── prisma/                # Contiene el archivo de esquema de Prisma para ORM.
│   │   └── schema.prisma      # Esquema de Prisma para la base de datos.
│   ├── package.json           # Archivo dependencias del backend.
│   ├── tsconfig.json          # Archivo de configuración de TypeScript.
│   ├── .env                   # Contiene las variables de entorno.
│   ├── jest.config.js         # Configuración de Jest para pruebas.
│   ├── .eslintrc.js           # Configuración de ESLint para el backend.
│   └── .prettierrc            # Configuración de Prettier para el backend.
├── frontend/                  # Contiene el código del lado del cliente escrito en React.
│   ├── src/                   # Contiene el código fuente para el frontend.
│   ├── public/                # Contiene archivos estáticos como el archivo HTML e imágenes.
│   ├── build/                 # Contiene la construcción lista para producción del frontend.
│   ├── package.json           # Archivo dependencias del frontend.
│   ├── tsconfig.json          # Archivo de configuración de TypeScript para el frontend.
│   ├── jest.config.js         # Configuración de Jest para pruebas del frontend.
│   ├── .eslintrc.js           # Configuración de ESLint para el frontend.
│   └── .prettierrc            # Configuración de Prettier para el frontend.
├── docker-compose.yml         # Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
└── README.md                  # Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.
```
### Stack de tecnologías

- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Base de datos: PostgreSQL
- ORM: Prisma


## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias para el frontend y el backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Construye el servidor backend:
```
cd backend
npm run build
````
4. Inicia el servidor backend:
```
cd backend
npm run dev 
```

5. En una nueva ventana de terminal, construye el servidor frontend:
```
cd frontend
npm run build
```
6. Inicia el servidor frontend:
```
cd frontend
npm start
```

El servidor backend estará corriendo en http://localhost:3010 y el frontend estará disponible en http://localhost:3000.

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:
```
docker-compose up -d
```
Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: LTIdb

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo .env.

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

backend/src/
├── domain/
│   ├── entities/
│   │   └── Candidate.ts
│   ├── repositories/
│   │   └── ICandidateRepository.ts
│   └── services/
│       └── CandidateService.ts
├── application/
│   ├── dtos/
│   │   └── CandidateDTO.ts
│   └── useCases/
│       └── CreateCandidateUseCase.ts
├── infrastructure/
│   ├── controllers/
│   │   └── CandidateController.ts
│   ├── repositories/
│   │   └── PrismaCandidateRepository.ts
│   ├── routes/
│   │   └── candidateRoutes.ts
│   └── middlewares/
│       ├── errorHandler.ts
│       ├── validateRequest.ts
│       └── fileUpload.ts
└── index.ts