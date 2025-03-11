# LTI - Sistema de Seguimiento de Talento

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
    - `controllers/`: Contiene los controladores para manejar las solicitudes.
    - `routes/`: Contiene las rutas de la API.
    - `tests/`: Contiene los tests unitarios para los controladores.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM y el archivo de seed.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
    - `components/`: Contiene los componentes de React.
    - `App.js`: El punto de entrada para la aplicación frontend.
    - `App.css`: Archivo de estilos CSS para la aplicación frontend.
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
- El directorio `prisma` contiene el esquema de Prisma y el archivo de seed.

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
3. Ejecuta las migraciones de Prisma:
```sh
cd backend
npm run prisma:migrate
npm run prisma:generate
```
4. Construye el servidor backend:
```sh
cd backend
npm run build
```
5. Inicia el servidor backend:
```sh
cd backend
npm run dev 
```

6. En una nueva ventana de terminal, construye el servidor frontend:
```sh
cd frontend
npm run build
```
7. Inicia el servidor frontend:
```sh
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

## Tests

Este proyecto utiliza Jest para los tests unitarios. Los tests están ubicados en el directorio `src/tests` del backend.

Para ejecutar los tests, utiliza el siguiente comando:
```sh
cd backend
npm test
```

Esto ejecutará los tests y generará un informe de cobertura.

## Seed de la Base de Datos

Para poblar la base de datos con datos de ejemplo, puedes ejecutar el script de seed:
```sh
cd backend
npm run prisma:seed
```

Esto insertará datos de ejemplo en la base de datos para que puedas comenzar a trabajar con la aplicación de inmediato.