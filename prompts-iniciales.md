-----
PROMPT #1
-----

Estamos actualmente en la raiz de un proyecto. Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

El proyecto está dividido en dos directorios principales: frontend y backend.

- El frontend es una aplicación React y sus archivos principales están ubicados en el directorio src. El directorio public contiene activos estáticos y el directorio build contiene la construcción de producción de la aplicación.

- El backend es una aplicación Express escrita en TypeScript. El directorio src contiene el código fuente. El directorio prisma contiene el esquema de Prisma.

Necesito iniciar este proyecto asi que tus tareas son: 
1. Instala las dependencias para el frontend y el backend
2. Construye el servidor backend
3. Inicia el servidor backend
4. En una nueva ventana de terminal, construye el servidor frontend
5. Inicia el servidor frontend
6. Ejecuta el siguiente comando para iniciar el contenedor Docker:

docker-compose up -d

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:

Host: localhost
Port: 5432
User: postgres
Password: password
Database: mydatabase
Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en @.env 

Corrige los errores que sean necesarios para corregir, manten la estructura tal como esta, y evita crear funcionalidades en el proceso. Solo necesito que todo este bien seteado para que funcione correctamente

-----
PROMPT #2
-----

Docker definitivamente sigue sin funcionar y opte por descargar e instalar PostgreSQL podemos continuar ? 

-----
PROMPT #3
-----

Ahora quiero que consideres la siguiente historia de usuario, para considerar en el proyecto actual ATS: 

Como reclutador, quiero tener la capacidad de añadir candidatos al sistema ATS, para que pueda gestionar sus datos y procesos de selección de manera eficiente.

#Criterios de Aceptación:
- Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
- Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
- Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
- Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
- Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
- Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
- Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.

#Notas:
- La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
- Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.

#Tareas Técnicas:
- Implementar la interfaz de usuario para el formulario de añadir candidato.
- Desarrollar el backend necesario para procesar la información ingresada en el formulario.
- Asegurar la seguridad y privacidad de los datos del candidato.

No quiero que ejecutes ni desarrolles codigo aun. Quiero saber a partir de este contexto, y considerando el estado actual del proyecto, buscando mantener una implementacion clara, simple y robusta, en donde se requeriran tareas extra como, crear el modelo de datos, lanzar la migración en PostgreSQL, etc... 

Como definirias toda esta informacion en 3 tickets de trabajo a fondo, para que puedan ser usadas como input para un LLM ?

-----
PROMPT #4
-----

Con estos 3 tickets, me gustaria que lo ejecutaras para tener el resultado esperado de la historia de usuario. Manten el codigo simple, pero robusto, para que cumpla con la función requerida, y que sea facil y ligero de subir a un repositorio.

-----
PROMPT #5
-----

No funciona. Me genera una lista de errores: 

1. ERROR in ./src/App.tsx 5:0-74
Module not found: Error: Can't resolve 'react-router-dom' in 'D:\Projects\2025\AI4Devs\Sesion3\Ejercicio2\frontend\src'
2. ERROR in ./src/services/api.ts 3:0-26
Module not found: Error: Can't resolve 'axios' in 'D:\Projects\2025\AI4Devs\Sesion3\Ejercicio2\frontend\src\services'