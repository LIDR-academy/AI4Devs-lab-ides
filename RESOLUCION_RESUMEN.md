# Resolución Final del Proyecto

## 1. Resumen de los Prompts Utilizados

A lo largo del desarrollo del proyecto, se realizaron las siguientes peticiones:

- **Configuración del backend y frontend**: Se solicitó ayuda para establecer la conexión entre el frontend y el backend, así como para la configuración de Docker y PostgreSQL.
- **Resolución de errores**: Se pidieron soluciones para errores específicos, como problemas de conexión, errores de puerto en uso y errores de validación en las pruebas.
- **Actualizaciones de código**: Se solicitaron cambios en el código para mejorar la funcionalidad, como la carga de archivos y la validación de datos.
- **Documentación**: Se pidió un resumen de los cambios realizados y un instructivo para el equipo de trabajo.

## 2. Resumen de Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para el backend, permitiendo la creación de aplicaciones del lado del servidor.
- **Express**: Framework para Node.js que facilita la creación de APIs y el manejo de rutas.
- **Prisma**: ORM (Object-Relational Mapping) utilizado para interactuar con la base de datos PostgreSQL de manera sencilla y eficiente.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar la información de los candidatos.
- **React**: Biblioteca de JavaScript para construir interfaces de usuario en el frontend.
- **Yup**: Biblioteca para la validación de esquemas de datos en el frontend.
- **Axios**: Biblioteca para realizar solicitudes HTTP desde el frontend al backend.
- **Docker**: Herramienta para crear, desplegar y ejecutar aplicaciones en contenedores, facilitando la gestión de dependencias y entornos.

## 3. Tareas que Causaron Más Problemas

- **Configuración de CORS**: Hubo dificultades para permitir que el frontend se comunicara con el backend debido a problemas de CORS. Esto se resolvió habilitando CORS en el servidor Express.
- **Errores de Puerto en Uso**: Se presentaron problemas al intentar iniciar el servidor debido a que el puerto ya estaba en uso. Esto requirió la identificación y detención de procesos en ejecución.
- **Validación de Datos**: La validación de datos en el controlador de candidatos causó confusión, especialmente al manejar errores de validación y la estructura de los datos enviados desde el frontend.

## 4. Organización Cronológica de los Tickets

### Ticket 1: Configuración Inicial
- Se configuró el entorno de desarrollo, incluyendo la instalación de dependencias y la configuración de Docker y PostgreSQL.

### Ticket 2: Desarrollo de Funcionalidades
- Se implementaron las funcionalidades para añadir candidatos, incluyendo la carga de archivos y la validación de datos.
- Se realizaron pruebas para asegurar que las funcionalidades funcionaran correctamente.

### Ticket 3: Resolución de Errores y Optimización
- Se abordaron errores de conexión, problemas de puerto y validación de datos.
- Se realizaron ajustes en el código para mejorar la experiencia del usuario y la estabilidad de la aplicación.

## 5. Instructivo para Operar la Aplicación

### Estructura del Proyecto
- **backend/**: Contiene el código del servidor.
- **frontend/**: Contiene el código del cliente.

### Librerías y Herramientas a Instalar
- **Node.js**: Versión 14 o superior.
- **Docker**: Versión 20 o superior.
- **Dependencias del Backend**:
  - Express
  - Prisma
  - PostgreSQL
  - CORS
- **Dependencias del Frontend**:
  - React
  - Axios
  - Yup
  - Material-UI

### Pasos para Ejecutar la Aplicación
1. Clona el repositorio.
2. Navega al directorio del backend y ejecuta:
   ```bash
   npm install
   npm run dev
   ```
3. Navega al directorio del frontend y ejecuta:
   ```bash
   npm install
   npm start
   ```
4. Asegúrate de que Docker esté ejecutándose y que la base de datos PostgreSQL esté en funcionamiento.

## 6. Agradecimientos

Agradecemos a **Cursor** y sus agentes, así como a los modelos utilizados como **Clode-3.7-sonet**, **gpt 4o**, **gpt-4o-mini** y **cursor-small**, por su apoyo en el desarrollo de este proyecto.

## 7. Pull Request

### Título del Pull Request: Entrega Final del Proyecto

**Descripción**:
Este pull request contiene la entrega final del proyecto "Sistema de Seguimiento de Talento". A pesar de las dificultades encontradas, hemos trabajado arduamente para resolver los problemas y completar las funcionalidades requeridas. Aunque la entrega estaba programada para el 09 de marzo, hemos perseverado y continuaremos esforzándonos y aprendiendo en el futuro.

Agradecemos su comprensión y esperamos que revisen nuestra entrega.

---
