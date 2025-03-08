# Prompt Inicial - Modelo gpt-4o de CodeGPY

# Prompt inicial

# LTI - Sistema de seguimiento de talento (ATS)

El proyecto que estoy desarrollando es un sistema de seguimiento de talento (ATS) que se llama "LTI". 
Para ello quiero desarrollar 3 partes: backend, frontend y una base de datos. Como puedes ver en el proyecto, ya tengo una estructura con las siguientes tecnologías:

- Backend: Nodejs y Express
- Frontend: React
- Base de datos: PostgreSQL con Prisma

Con esta información general del proyecto, y apoyandote en los ficheros actuales del workspace, quiero que me ayudes a realizar la primera historia de usuario del proyecto:

# Añadir Candidato al Sistema
**Como** reclutador,
**Quiero** tener la capacidad de añadir candidatos al sistema ATS,
**Para que** pueda gestionar sus datos y procesos de selección de manera eficiente.

## Criterios de Aceptación:

1. **Accesibilidad de la función:** Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
2. **Formulario de ingreso de datos:** Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
3. **Validación de datos:** El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
4. **Carga de documentos:** El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
5. **Confirmación de añadido:** Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
6. **Errores y manejo de excepciones:** En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
7. **Accesibilidad y compatibilidad:** La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.

## Notas:

- La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
- Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.

## Tareas Técnicas:

- Implementar la interfaz de usuario para el formulario de añadir candidato.
- Desarrollar el backend necesario para procesar la información ingresada en el formulario.
- Asegurar la seguridad y privacidad de los datos del candidato.

## Extra

- Para la validación de datos en React me gustaría que utilizaras la librería zod.
- El fichero debe guardarse en una carpeta del backend por ahora. Asegurate de que está en formato PDF o DOCX y que el fichero no supera los 10mb.

Quiero que vayamos paso a paso, para que así pueda ir validando cada parte y ver que es correcta. Para ello comienza primero con la parte de la base de datos en prisma, despues continuaremos con el backend y finalmente con el frontend.

Si tienes cualquier duda ahora, antes o después de cada paso, no dudes en preguntarme.

# Otro prompts

```
Haz un resumen a modo de texto, sin nada de código, de que hemos añadido al proyecto hasta ahora.
```

```
Actualiza el fichero README con la nueva información.
```
