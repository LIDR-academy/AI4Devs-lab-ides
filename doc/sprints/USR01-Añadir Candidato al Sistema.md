# Añadir Candidato al Sistema

## Historia de Usuario

**Como** reclutador,
**Quiero** tener la capacidad de añadir candidatos al sistema ATS,
**Para que** pueda gestionar sus datos y procesos de selección de manera eficiente.

## Criterios de Aceptación

1. **Accesibilidad de la función**: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
2. **Formulario de ingreso de datos**: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato:
   - Nombre
   - Apellido
   - Correo electrónico
   - Teléfono
   - Dirección
   - Educación
   - Experiencia laboral
3. **Validación de datos**:
   - El formulario debe validar los datos ingresados para asegurar que son completos y correctos.
   - El correo electrónico debe tener un formato válido.
   - Los campos obligatorios no deben estar vacíos.
4. **Carga de documentos**:
   - El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
5. **Confirmación de añadido**:
   - Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
6. **Errores y manejo de excepciones**:
   - En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
7. **Accesibilidad y compatibilidad**:
   - La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.

## Notas

- La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
- Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.

## Tareas Técnicas

### Frontend
1. Implementar la interfaz de usuario para el formulario de añadir candidato.
2. Asegurar que el diseño sea responsive y accesible.
3. Implementar validaciones en el formulario de ingreso de datos.
4. Agregar la funcionalidad de carga de documentos con restricción de formatos (PDF y DOCX).
5. Mostrar mensajes de confirmación o error según corresponda.

### Backend
1. Desarrollar el endpoint para recibir y procesar la información del formulario.
2. Implementar validaciones y sanitización de datos en el backend.
3. Almacenar los datos del candidato en la base de datos.
4. Implementar la lógica para almacenar archivos adjuntos (CVs) en un servicio de almacenamiento.
5. Manejar errores y excepciones adecuadamente.

### Seguridad y Privacidad
1. Implementar medidas de seguridad para proteger los datos del candidato.
2. Asegurar que solo usuarios autorizados puedan añadir candidatos.
3. Cifrar la información sensible almacenada en la base de datos.
