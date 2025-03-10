# Prompt para Desarrollar el Backend

## Descripción
Crea el backend necesario para procesar la información ingresada en el formulario de añadir candidato. Asegúrate de que los datos se validen y almacenen correctamente.

## Tareas Específicas
1. **Estructura del Backend:**
   - Configurar rutas para recibir datos del formulario y procesarlos adecuadamente.
   - Explica cómo debe estructurarse el backend para recibir y procesar los datos del formulario de añadir candidato.
   - Crea los archivos de controladores y servicios en Express necesarios para esta funcionalidad

2. **Campos a Manejar:**
   - **Nombre:** Validar que el campo no esté vacío y contenga solo caracteres alfabéticos.
   - **Apellido:** Validar que el campo no esté vacío y contenga solo caracteres alfabéticos.
   - **Correo Electrónico:** Validar que el correo tenga un formato válido.
   - **Teléfono:** Validar que el campo contenga solo números y tenga el formato adecuado.
   - **Dirección:** Asegurar que el campo no esté vacío.
   - **Educación:** Validar que el campo no esté vacío y considerar la integración de autocompletado.
   - **Experiencia Laboral:** Validar que el campo no esté vacío y considerar la integración de autocompletado.
   - **CV:** Asegurar que el archivo cargado sea en formato PDF o DOCX.

3. **Validación de Datos:**
   - Implementar validaciones para asegurar que los datos ingresados son completos y correctos, especialmente el formato del correo electrónico y los campos obligatorios.

4. **Manejo de Datos:**
   - Transformar y validar datos antes de almacenarlos en la base de datos.

5. **Errores y Manejo de Excepciones:**
   - Implementar manejo de errores para fallos en la conexión o validaciones, mostrando mensajes adecuados al usuario.

## Ejemplos y Casos de Uso
- Proporciona ejemplos de cómo manejar errores de validación y conexión.
- Incluye casos de uso para la transformación de datos.

## Archivos Necesarios
- Schema de Prisma para la base de datos.
- Controladores y servicios en Express para manejar las solicitudes.
- Archivo .env para la configuración de variables de entorno y archivos de configuración para la base de datos, migraciones con modelos y seeders, así como la conexión a la base de datos e instrucciones detalladas para aplicar ejectar las migraciones y seeders.