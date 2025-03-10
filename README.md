# Sistema de Gestión de Candidatos

Este proyecto es un sistema de gestión de candidatos para reclutadores, que permite añadir, editar, ver y eliminar candidatos, así como gestionar sus currículums.

## Características

- Interfaz de usuario minimalista con colores pasteles usando Bootstrap
- Formulario de ingreso de datos con validaciones
- Carga de documentos (CV en formato PDF o DOCX)
- API RESTful segura
- Base de datos PostgreSQL con Prisma ORM
- Manejo de errores y mensajes de confirmación

## Tecnologías Utilizadas

### Frontend
- React
- TypeScript
- Bootstrap
- Formik y Yup para validaciones
- React Router para navegación
- Axios para peticiones HTTP
- React Toastify para notificaciones

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Multer para manejo de archivos
- Express Validator para validaciones
- Helmet para seguridad

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Instalación

### Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sistema-gestion-candidatos
```

### Configurar el Backend

1. Navegar al directorio del backend:

```bash
cd backend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` basado en `.env.example`
   - Configurar la conexión a la base de datos

4. Ejecutar migraciones de Prisma:

```bash
npx prisma migrate dev
```

5. Generar el cliente de Prisma:

```bash
npx prisma generate
```

### Configurar el Frontend

1. Navegar al directorio del frontend:

```bash
cd ../frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` basado en `.env.example`
   - Configurar la URL de la API

## Ejecución

### Backend

```bash
cd backend
npm run dev
```

El servidor se iniciará en http://localhost:3010

### Frontend

```bash
cd frontend
npm start
```

La aplicación se abrirá en http://localhost:3000

## Seguridad

Este proyecto implementa varias medidas de seguridad:

- Validación y sanitización de entradas
- Uso de Helmet para protección de cabeceras HTTP
- Manejo seguro de archivos
- Mensajes de error genéricos en producción
- Uso de ORM para prevenir SQL Injection

## Estructura del Proyecto

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── uploads/
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   ├── types/
    │   ├── utils/
    │   └── App.tsx
    └── package.json
```

## Contribución

1. Hacer un fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.