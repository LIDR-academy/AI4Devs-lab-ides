# Prompts Iniciales y Tickets de Trabajo

## Contexto del Proyecto

El proyecto LTI (Sistema de Seguimiento de Talento) está configurado con:
- Frontend en React
- Backend en Express con TypeScript
- Base de datos PostgreSQL

Credenciales de la base de datos:
- Usuario: LTIdbUser
- Contraseña: password123 (simplificada desde la original)
- Base de datos: LTIdb
- Puerto: 5432

## Historia de Usuario

**Añadir Candidato al Sistema**

Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

### Criterios de Aceptación:

1. **Accesibilidad de la función**: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
2. **Formulario de ingreso de datos**: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
3. **Validación de datos**: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
4. **Carga de documentos**: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
5. **Confirmación de añadido**: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
6. **Errores y manejo de excepciones**: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
7. **Accesibilidad y compatibilidad**: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.

### Notas:

- La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
- Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.

## Tickets de Trabajo

### Ticket 1: Modelo de Datos y Backend para Candidatos

**Descripción:**
Implementar el modelo de datos para los candidatos en la base de datos PostgreSQL y desarrollar las APIs necesarias en el backend para gestionar la información de los candidatos.

**Tareas:**
1. Definir el modelo de datos para los candidatos en el schema.prisma
2. Crear la migración en PostgreSQL
3. Implementar las rutas de API RESTful:
   - POST /api/candidates - Crear un nuevo candidato
   - GET /api/candidates - Listar todos los candidatos
   - GET /api/candidates/:id - Obtener detalles de un candidato específico
4. Implementar validación de datos en el backend
5. Configurar el almacenamiento para los archivos CV (PDF/DOCX)
6. Implementar manejo de errores y respuestas adecuadas

**Criterios de Aceptación:**
- El modelo de datos debe incluir todos los campos requeridos (nombre, apellido, correo, teléfono, dirección, educación, experiencia)
- Las APIs deben validar correctamente los datos de entrada
- El sistema debe manejar adecuadamente la carga y almacenamiento de archivos
- Las respuestas de la API deben seguir estándares RESTful

### Ticket 2: Interfaz de Usuario para Añadir Candidatos

**Descripción:**
Desarrollar la interfaz de usuario en React para permitir a los reclutadores añadir nuevos candidatos al sistema.

**Tareas:**
1. Crear un botón/enlace en el dashboard principal para "Añadir Candidato"
2. Diseñar e implementar el formulario con todos los campos requeridos
3. Implementar validación de formularios en el frontend
4. Crear componente para carga de archivos (CV)
5. Implementar mensajes de confirmación y error
6. Asegurar que la interfaz sea responsiva y compatible con diferentes dispositivos

**Criterios de Aceptación:**
- La interfaz debe ser intuitiva y fácil de usar
- El formulario debe validar los datos antes de enviarlos al servidor
- Debe haber indicadores visuales claros para campos obligatorios
- Los mensajes de éxito/error deben ser claros y descriptivos
- La interfaz debe ser responsiva y funcionar en diferentes tamaños de pantalla

### Ticket 3: Integración y Pruebas

**Descripción:**
Integrar el frontend y backend, realizar pruebas exhaustivas y asegurar que todo el flujo de trabajo funcione correctamente.

**Tareas:**
1. Conectar el formulario del frontend con las APIs del backend
2. Implementar manejo de estados de carga (loading states)
3. Realizar pruebas de integración del flujo completo
4. Verificar la seguridad y privacidad de los datos
5. Optimizar el rendimiento si es necesario
6. Documentar la funcionalidad implementada

**Criterios de Aceptación:**
- El flujo completo de añadir un candidato debe funcionar sin errores
- Los datos deben guardarse correctamente en la base de datos
- Los archivos CV deben almacenarse y ser accesibles posteriormente
- El sistema debe manejar adecuadamente casos de error (conexión perdida, servidor caído, etc.)
- La experiencia de usuario debe ser fluida y sin interrupciones
