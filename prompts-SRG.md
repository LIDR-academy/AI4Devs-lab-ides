#Prompt 1 para Claude 3.7 con el fin de hacer meta prompting 

Eres un experto en prompting, me están pidiendo la siguiente historia de usuario para mi software "Esta es la historia de usuario que hay que trabajar:
Añadir Candidato al Sistema
Como reclutador, Quiero tener la capacidad de añadir candidatos al sistema ATS, Para que pueda gestionar sus datos y procesos de selección de manera eficiente. Criterios de Aceptación:
1. Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
2. Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
3. Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
4. Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
5. Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
6. Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
7. Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
Notas:
* La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
* Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.
Tareas Técnicas:
* Implementar la interfaz de usuario para el formulario de añadir candidato.
* Desarrollar el backend necesario para procesar la información ingresada en el formulario.
* Asegurar la seguridad y privacidad de los datos del candidato."

--

te voy a dar un poco más de contexto para que ajustes y mejores aún más ese prompt "LTI - Sistema de Seguimiento de Talento
Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.
Explicación de Directorios y Archivos
* backend/: Contiene el código del lado del servidor escrito en Node.js.
   * src/: Contiene el código fuente para el backend.
      * index.ts: El punto de entrada para el servidor backend.
   * prisma/: Contiene el archivo de esquema de Prisma para ORM.
   * tsconfig.json: Archivo de configuración de TypeScript.
   * .env: Contiene las variables de entorno.
* frontend/: Contiene el código del lado del cliente escrito en React.
   * src/: Contiene el código fuente para el frontend.
   * public/: Contiene archivos estáticos como el archivo HTML e imágenes.
   * build/: Contiene la construcción lista para producción del frontend.
* docker-compose.yml: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
* README.md: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.
Estructura del Proyecto
El proyecto está dividido en dos directorios principales: frontend y backend.
Frontend
El frontend es una aplicación React y sus archivos principales están ubicados en el directorio src. El directorio public contiene activos estáticos y el directorio build contiene la construcción de producción de la aplicación.
Backend
El backend es una aplicación Express escrita en TypeScript.
* El directorio src contiene el código fuente
* El directorio prisma contiene el esquema de Prisma."

--

 Me debes entregar un prompt que le permita a mi LLM desarrollar las tareas especificadas siguiendo las buenas practicas del desarrollo de software.

#Prompt 2 para Cursor utilizando Claude 3.7

Desarrolla la implementación completa para la funcionalidad "Añadir Candidato al Sistema" en el Sistema de Seguimiento de Talento (LTI), respetando la arquitectura actual del proyecto:

1. FRONTEND (React):
   - Ubicación: En el directorio `frontend/src/`
   - Crear los siguientes componentes:
     * Botón/enlace de "Añadir Candidato" para el dashboard principal
     * Formulario modal o página de formulario para la captura de datos
     * Componentes de validación para cada campo
     * Componente de carga de archivos para el CV
     * Mensajes de confirmación/error
   - Implementar lógica de autocompletado para campos de educación/experiencia
   - Asegurar que el diseño sea responsive siguiendo los patrones de UI existentes
   - Incluir los hooks necesarios para gestionar el estado del formulario y la comunicación con la API

2. BACKEND (Express + TypeScript + Prisma):
   - Ubicación: En el directorio `backend/src/`
   - Crear:
     * Controlador para gestionar las peticiones de creación de candidatos
     * Middleware para validación de datos y archivos
     * Implementación de endpoint en Express para procesar la solicitud
     * Servicios para manejar la lógica de negocio
   - Configurar el almacenamiento de archivos para los CVs
   - Implementar manejo estructurado de errores

3. MODELO DE DATOS (Prisma):
   - Ubicación: `backend/prisma/schema.prisma`
   - Definir o extender el modelo de Candidato con todos los campos necesarios:
     * Información personal
     * Referencias a modelos de educación y experiencia laboral
     * Referencia a la ubicación del CV almacenado
   - Crear las migraciones necesarias

4. SEGURIDAD Y VALIDACIÓN:
   - Implementar validaciones tanto en el cliente como en el servidor
   - Asegurar la sanitización de datos
   - Implementar medidas de seguridad para la carga de archivos

5. PRUEBAS:
   - Crear tests unitarios para componentes React
   - Crear tests para los endpoints de la API
   - Incluir tests de integración

Entrega el código completo organizado según la estructura de directorios existente, con comentarios claros y siguiendo las convenciones de estilo del proyecto. Para cada archivo creado, especifica su ubicación exacta dentro del proyecto.

Como parte de la entrega, incluye:
1. Cambios en el esquema de Prisma
2. Nuevos componentes React y su integración con el sistema existente
3. Nuevos endpoints de API y su documentación
4. Estrategia para el almacenamiento y recuperación de CVs
5. Consideraciones de UX para facilitar el uso por parte de los reclutadores


#Prompt 3 para Cursor utilizando Claude 3.7

Se me presenta el siguiente error al momento de querer crear un candidato, haz el ajuste necesario.
--
Error al crear candidato: TypeError: Cannot read properties of undefined (reading 'count')
--
Adicionalmente podrías explicarme como funciona PRISMA como ORM, es la primera vez que hago uso de este. Debo ejecutar algún comando despues de definir los modelos? 


#Prompt 4 para Claude 3.7 para hacer meta prompting