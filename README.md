# LTI - Sistema de Seguimiento de Talento

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
    - `controllers/`: Contiene los controladores para manejar la lógica de las rutas.
    - `routes/`: Contiene las definiciones de las rutas del servidor.
    - `middlewares/`: Contiene middlewares personalizados para el servidor.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
    - `components/`: Contiene los componentes React utilizados en la aplicación.
    - `pages/`: Contiene las páginas principales de la aplicación.
    - `App.tsx`: El componente principal de la aplicación.
    - `index.tsx`: El punto de entrada para el frontend.
    - `index.css`: Archivo de estilos globales.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript.
- El directorio `src` contiene el código fuente.
  - `controllers/`: Contiene los controladores para manejar la lógica de las rutas.
  - `routes/`: Contiene las definiciones de las rutas del servidor.
  - `middlewares/`: Contiene middlewares personalizados para el servidor.
- El directorio `prisma` contiene el esquema de Prisma.

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
 - Database: mydatabase

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo .env.

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

## Nuevas Funcionalidades Añadidas

### Integración de TailwindCSS

Hemos integrado TailwindCSS en el proyecto para facilitar el diseño y la estilización de los componentes de React.

### Rutas en el Frontend

Hemos configurado las rutas utilizando **react-router-dom** para gestionar diferentes vistas en la aplicación:

- Una ruta para ver la lista de candidatos.
- Una ruta para añadir un nuevo candidato.

### Configuración del Backend

Hemos configurado el backend utilizando Express y Prisma:

- **Configuración de CORS:** Configuramos CORS para permitir la comunicación entre el frontend y el backend.
- **Endpoints:**- Añadimos endpoints para obtener la lista de candidatos y para añadir un nuevo candidato.
- **Controladores:** Implementamos controladores para manejar la lógica de añadir y obtener candidatos.

###Integración de Prisma

Estamos utilizando Prisma como ORM para interactuar con la base de datos, facilitando las operaciones CRUD sobre los candidatos.
