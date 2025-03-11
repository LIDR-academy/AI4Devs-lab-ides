Primero de todo, quiero disculparme porque no he sido listo y no he guardado todo el historial de prompts que he usado. Solo tengo el primero porque este si que lo trabaje fuera del chat.

Queria tambien aprovechar para comentar que el desarrollo está hecho pero he ido más allá ante la posibilidad de hacerlo. Como vereis he implementado multiples funcionalidades en el concepto de añadir candidatos PERO tambien he añadido el VER y editar (Que por cierto, no lo he podido terminar por problemas con cursor que me abortaba la misión). He añadido tambien toda la parte de login y otras funcionalidades base que creia necesario.

1. Para entender mi estrategia... he partido del prompt principal y he ido haciendo DB --> Backend --> FrontEnd.

2. Luego ha habido una larga y dura fase de bugfixing, ajustar base de datos, checkear que todo esta correctamente guardado, etc (Aun se pueden mejorar cosas).

3. He implementado tambien puntos basicos como el Login y la authentificacion (No creacion de usuarios, se añade un usuario de pruebas)

4. A medio desarrollo en un punto de checkpoint le he pedido en el chat que revisara el codigo e hiciera recomendaciones para mejorar. Estas son las que me ha recomendado (Y he hecho unas pocas, las evidentes)

- Logging Estructurado: Implementar un sistema de logging estructurado como Winston o Pino para un mejor seguimiento y análisis de errores.
- Documentación de API: Implementar Swagger/OpenAPI para documentación automática de la API.
- Caché: Implementar una estrategia de caché para datos frecuentemente accedidos, como Redis o un caché en memoria.
- Monitoreo: Implementar herramientas de monitoreo como Prometheus y Grafana para seguimiento de métricas y alertas.
- CI/CD: Configurar un pipeline de CI/CD para automatizar pruebas, linting y despliegue.
- Organización por Características: Considerar reorganizar el código por características en lugar de por tipo de archivo para mejorar la escalabilidad.
- Validación de Datos: Extender la validación de datos a todas las rutas y parámetros usando bibliotecas como Zod o Joi.
- Paginación: Implementar paginación para todas las rutas que devuelven listas.
- Transacciones de Base de Datos: Usar transacciones de Prisma para operaciones que involucran múltiples cambios en la base de datos.
- Pruebas: Aumentar la cobertura de pruebas, especialmente para casos de error y límites.

Finalmente, como he comentado, he incorporado mejoras de usabilidad (UX/UI) en el frontend, donde he detectado otros errores en el modelo de datos que he ido mejorando

#Lecciones Aprendidas

Antes de compartir el prompt quiero compartir varias lecciones aprendidas
1. Mejorar los prompts para que cursor no tome decisiones por si solo o implemente cosas extras a las que le has pedido.
2. Incorporar mejor el TDD a los prompts y asegurar que hagan las tareas. La verdad que esto lo hare estos dias porque es lo que me ha mosquedo. Le pedia hacer test a la vez que programaba y no hacia ni uno
3. Aun me falta entender mas Cursor en algunos flujos de como usarlo.

#Prompt1

Actua como un software enginer en las tecnologias usadas en este proyecto. Te han pasado esta historia de usuario que debes implementar de forma adecuada:

**Como** reclutador, **Quiero** tener la capacidad de añadir candidatos al sistema ATS, **Para que** pueda gestionar sus datos y procesos de selección de manera eficiente. Los **Criterios de Aceptación que nos han definido son los siguientes:**

1.  **Accesibilidad de la función:** Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
    
2.  **Formulario de ingreso de datos:** Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
    
3.  **Validación de datos:** El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
    
4.  **Carga de documentos:** El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
    
5.  **Confirmación de añadido:** Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
    
6.  **Errores y manejo de excepciones:** En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
    
7.  **Accesibilidad y compatibilidad:** La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
    

Se considera una buena práctica si trabajamos por separado toda la parte técnica:

*   Implementar la interfaz de usuario para el formulario de añadir candidato.
    
*   Desarrollar el backend necesario para procesar la información ingresada en el formulario.
    
*   Asegurar la seguridad y privacidad de los datos del candidato.
    

Vamos a ir paso a paso para que Lo primero que vamos a hacer es crear el esquema de base de datos que nos permita desarrollar la historia de usuario de forma exitosa. Hazme las preguntas que sean necesarias para el éxito de la tarea. Debes crear el modelo de datos y lanzar la migración en PostgreSQL Posteriormente recomiendo continuar con el backend para implementar toda la logica necesaria y exponer una api que sera documentada con swagger.

Quiero que sigas los estándares de desarrollo que hemos definido así como seguir una metodología de proyecto basada en DDD y TDD para un buen mantenimiento y escalabilidad de la aplicación y su código.

Como recomendaciones extra:

*   La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
    
*   Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.
    

Tomate el tiempo que creas necesario y hazme las preguntas que te ayuden a hacer tu tarea mejor.


#Prompt autocompletado

* Mi prompt
Now let's do a new feature and for now we are going to develop only for create candidate functionality. Let's develop an autocomplete functionaliity for skills. In other words, when user starts to type a new skill to add, let's autocomplete with an existing skill in database. Please, ask me questions if you have some doubt about the feature. For example, if the user starts typing "Jav" should appear a list with Java or Javascript if they are already in database. Take your time for the best implementation, and use standard market libraries if it's possible. 

* Respuesta principal

I'll implement an autocomplete functionality for skills in the candidate creation form. This will help users select existing skills from the database when they start typing.
Before I start, I have a few questions to clarify the requirements:
Do we have an existing API endpoint to search for skills in the database, or do we need to create one?
Should we show the autocomplete suggestions in a dropdown below the input field?
Should we allow users to create new skills if they don't exist in the database?
How many suggestions should we show at maximum in the dropdown?
While waiting for your answers, I'll start by exploring the current implementation and looking for suitable libraries for autocomplete functionality. React has several popular libraries for autocomplete, such as:
React Autocomplete
Downshift
React Select
Material-UI Autocomplete

* Mi respuesta

I think you have to create one specific api call to get a list of skills in the platform that are similar to an specific string. If they don't exist yes, the user can create new skills as we do nowadays. In other words, we doesn't need an api call to add an skill, on create candidate or edit candidate, if new skills are introduced, they are going to appear in database. let's show maximum 5 items

Nota: Con esto lo ha hecho todo a la primera, al final no tuve que hacer nada en el edit porque lo que hemos modificado es el componente comun