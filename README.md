# Sistema ATS - Módulo de Candidatos

Este proyecto implementa un sistema de seguimiento de candidatos (ATS) para reclutadores, con funcionalidad para añadir, editar, listar y eliminar candidatos.

## Funcionalidades

- Formulario para añadir candidatos con información personal, académica y profesional
- Carga de documentos (CV y foto)
- Validaciones en cliente y servidor
- API RESTful para gestión de candidatos
- Interfaz responsive adaptada a dispositivos móviles y de escritorio

## Tecnologías utilizadas

- **Frontend**: React, Next.js
- **CSS**: SASS con metodología BEM
- **Backend**: API Routes de Next.js
- **Almacenamiento de archivos**: Sistema de archivos local (en producción se recomendaría usar un servicio de almacenamiento en la nube)

## Requisitos previos

- Node.js 14.x o superior
- npm 7.x o superior

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/ats-system.git
cd ats-system
```

2. Instala las dependencias:

```bash
npm install
```

## Ejecución

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### Producción

Para construir y ejecutar la aplicación en modo producción:

```bash
npm run build
npm start
```

## Estructura del proyecto

```
├── public/
│   └── uploads/           # Carpeta para almacenar archivos subidos
│       ├── cv/            # CVs de candidatos
│       └── photos/        # Fotos de candidatos
├── src/
│   ├── api/               # Funciones cliente para comunicación con API
│   ├── components/        # Componentes React reutilizables
│   │   ├── candidates/    # Componentes específicos para candidatos
│   │   └── common/        # Componentes comunes (notificaciones, etc.)
│   ├── hooks/             # Custom hooks de React
│   ├── lib/               # Bibliotecas y utilidades
│   ├── pages/             # Páginas de Next.js (rutas)
│   │   ├── api/           # API Routes para el backend
│   │   └── dashboard/     # Páginas del dashboard
│   ├── styles/            # Estilos SASS
│   └── utils/             # Funciones de utilidad
└── package.json           # Dependencias y scripts
```

## Notas de desarrollo

- El sistema utiliza almacenamiento en memoria para los candidatos. En un entorno de producción, debe implementarse una base de datos persistente.
- Para mejorar la seguridad, se recomienda utilizar servicios de almacenamiento como AWS S3 o similares para los archivos en lugar del sistema de archivos local.
- Se ha implementado validación tanto en el cliente como en el servidor para garantizar la integridad de los datos.
