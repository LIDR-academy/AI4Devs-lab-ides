En el proyecto actual tengo que implementar una historia de usuario: "Añadir candidato al sistema":

Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

 - Criterios de Aceptación:
1. Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
2. Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
3. Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
4. Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
5. Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
6. Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
7. Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.

 - Notas:
1. La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
2. Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.

___ 


Actúa como un desarrollador senior frontend especializado en React+TypeScript con experiencia en desarrollo de ATS (Applicant Tracking Systems).

Necesito implementar el frontend para la funcionalidad "Añadir candidato al sistema" con estos requisitos específicos:

[HISTORIA DE USUARIO]
Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

[CRITERIOS DE ACEPTACIÓN]
1. Botón/enlace visible para añadir candidato desde el dashboard
2. Formulario con campos: nombre, apellido, email, teléfono, dirección, educación, experiencia laboral
3. Validaciones: formato email, campos obligatorios no vacíos
4. Carga de CV en formato PDF/DOCX
5. Mensaje de confirmación tras añadir candidato exitosamente
6. Manejo de errores (mostrar mensajes adecuados)
7. Compatible con dispositivos y navegadores

[CONSIDERACIONES TÉCNICAS]
- Implementación en React + TypeScript
- Utilizar componentes reutilizables
- Aplicar principios de accesibilidad (WCAG)
- Implementar diseño responsive
- Incluir validación de formularios
- Considerar funcionalidad de autocompletado para campos educación/experiencia

[ENTREGABLES ESPECÍFICOS]
1. Código fuente TypeScript del componente React principal
2. Estructura de tipos/interfaces
3. Implementación de validaciones
4. Gestión de estados del formulario
5. Simulación de interacción con backend

Prioriza código limpio, tipado estricto, y accesibilidad. No implementes el backend, solo simula las llamadas a la API. Utiliza prácticas modernas de React (hooks, componentes funcionales).

___

no funciona bien. Adjunto pantallazo del error

___


Realiza los siguientes ajustes: 
 - Al pulsar el botón cancelar del formuario, debes devolver al usuario al dashboard
 - Al pulsar el botón 'Guardar candidato' del formulario, si existen campos de entrada con datos incorrectos, sitúa el foco de la pantalla en el primer campo con error
 - El Breadcrumb debe ser clicable y dirigir al usuario a la categoría correcta
 
 
___


Ahora actúa como un desarrollador backend senior especializado en APIs RESTful y bases de datos relacionales.

Necesito que implementes el backend para procesar los datos de nuevos candidatos en nuestro sistema ATS (Applicant Tracking System). El frontend ya está implementado con un formulario que envía los siguientes datos: nombre, apellido, email, teléfono, dirección, educación, experiencia laboral y un archivo de CV (PDF/DOCX).

[REQUISITOS TÉCNICOS]
- Utiliza Node.js con Express o NestJS para crear la API
- Implementa un endpoint POST para recibir y procesar los datos del candidato
- Conecta con nuestra base de datos PostgreSQL (ya instalada en Docker)
- Valida los datos recibidos del frontend antes de guardarlos
- Procesa y almacena el archivo CV en un sistema de archivos o servicio de almacenamiento
- Implementa manejo de errores robusto con respuestas HTTP apropiadas
- Sigue principios RESTful y buenas prácticas de seguridad y TDD

[DETALLES DE INFRAESTRUCTURA]
- La base de datos PostgreSQL está configurada en Docker para el entorno local
- Las credenciales y configuración de conexión están disponibles en el archivo .env ubicado en la carpeta 'backend'
- Estructura la base de datos con las tablas y relaciones necesarias para almacenar toda la información del candidato

[ENTREGABLES ESPERADOS]
1. Código fuente del servidor API
2. Scripts SQL para crear/migrar el esquema de la base de datos
3. Documentación de los endpoints creados
4. Instrucciones para ejecutar el backend localmente
5. Manejo de casos de error y validaciones del lado del servidor

[CONSIDERACIONES ADICIONALES]
- Implementa logging para facilitar la depuración
- Asegura que el backend maneje correctamente archivos de diferentes tamaños
- Considera la implementación de rate limiting para prevenir abusos
- Implementa sanitización de entrada para prevenir inyecciones SQL y otros ataques


___

1. conecta el frontend con el backend
2. implementa también en el backend un endpoint para listar todos los candidatos y utilizalo en el frontend como resultado de pulsar el botón "Ver todos los candidatos"
3. Asegura la seguridad y privacidad de los datos del candidato


___

hay errores en el frontend. Adjunto pantallazo con los detalles

___

añade mensajes descriptivos cuando sucedan errores de validación. Asegúrate de que el formulario es coherente con las validaciones

___

implementa la funcionalidad del frontend de "Candidatos recientes", donde se muestren los 3 últimos candidatos consultados