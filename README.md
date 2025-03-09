# LTI - Sistema de Seguimiento de Talento

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `controllers/`: Controladores para manejar las solicitudes HTTP.
    - `middlewares/`: Middlewares para procesamiento de solicitudes, validación y manejo de errores.
    - `routes/`: Definición de rutas de la API.
    - `services/`: Lógica de negocio y operaciones de base de datos.
    - `types/`: Definiciones de tipos TypeScript.
    - `utils/`: Utilidades y funciones auxiliares.
    - `index.ts`: El punto de entrada para el servidor backend.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `uploads/`: Directorio para almacenar archivos subidos (CVs).
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
    - `components/`: Componentes React reutilizables.
    - `pages/`: Páginas principales de la aplicación.
    - `services/`: Servicios para comunicación con el backend.
    - `types/`: Definiciones de tipos TypeScript.
    - `utils/`: Utilidades y funciones auxiliares.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

#### Características principales del frontend:
- Formulario completo para añadir candidatos con validación en tiempo real
- Soporte para carga de archivos (CV en formato PDF o DOCX)
- Validación de formatos de correo electrónico y teléfono
- Manejo de fechas opcionales para educación y experiencia en curso
- Protección de datos sensibles mediante enmascaramiento
- Interfaz de usuario intuitiva y responsiva

### Backend

El backend es una aplicación Express escrita en TypeScript.
- El directorio `src` contiene el código fuente organizado según el patrón MVC
- El directorio `prisma` contiene el esquema de Prisma para la base de datos
- El directorio `uploads` almacena los archivos CV de forma segura

#### Características principales del backend:
- API RESTful para la gestión de candidatos
- Validación robusta de datos de entrada con Zod
- Almacenamiento seguro de archivos con validación de tipos
- Protección de datos sensibles mediante cifrado
- Manejo centralizado de errores con respuestas estandarizadas
- Estructura modular y escalable

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
3. Configura las variables de entorno:
   - Crea un archivo `.env` en el directorio `backend` con las siguientes variables:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/LTIdb?schema=public"
   PORT=3010
   ENCRYPTION_KEY="tu-clave-de-cifrado-segura-de-32-caracteres"
   ```

4. Inicia la base de datos PostgreSQL con Docker:
```sh
docker-compose up -d
```

5. Aplica el esquema de Prisma a la base de datos:
```sh
cd backend
npx prisma db push
```

6. Inicia el servidor backend:
```
cd backend
npm run dev 
```

7. En una nueva ventana de terminal, inicia el servidor frontend:
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

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

## Seguridad y Protección de Datos

El sistema implementa varias medidas para proteger los datos sensibles:

1. **Cifrado de datos**: Los datos sensibles como correos electrónicos y teléfonos se cifran antes de almacenarse en la base de datos.
2. **Almacenamiento seguro de archivos**: Los CVs se almacenan con nombres aleatorios y se implementan restricciones de acceso.
3. **Validación robusta**: Se validan todos los datos de entrada para prevenir inyecciones y otros ataques.
4. **Enmascaramiento de datos**: Los datos sensibles se enmascaran en la interfaz de usuario para proteger la privacidad.
5. **Manejo seguro de errores**: Los mensajes de error no revelan información sensible sobre el sistema.

## Últimas Actualizaciones

- Implementación de fechas opcionales para educación y experiencia en curso
- Mejora en la validación de datos en el backend
- Implementación de protección de datos sensibles
- Mejora en el manejo de errores y mensajes de usuario
- Optimización del almacenamiento de archivos