# Prompt para Implementar la Interfaz de Usuario

## Descripción
Desarrolla la interfaz de usuario para el formulario de añadir candidato al sistema ATS. La interfaz debe ser intuitiva, accesible y compatible con diferentes dispositivos y navegadores. Respetando los lineamientos definidos en @README.md

## Tareas Específicas
1. **Accesibilidad de la Función:**
   - Crea una nueva página en el dashboard del reclutador para añadir un nuevo candidato.
   - Diseñar un botón o enlace claramente visible en la página principal del dashboard del reclutador para añadir un nuevo candidato usando una ventana modal.
   - Diseña la interfaz de usuario para el formulario de añadir candidato que se mostrará en la ventana modal, teniendo en cuenta que debe ser accesible y compatible con diferentes dispositivos y navegadores.
   - Solicita la creación de los archivos de componentes de React necesarios para implementar esta interfaz.

2. **Formulario de Ingreso de Datos:**
   - Crear un formulario que incluya los siguientes campos:
     - **Nombre:** Campo de texto para ingresar el nombre del candidato.
     - **Apellido:** Campo de texto para ingresar el apellido del candidato.
     - **Correo Electrónico:** Campo de texto para ingresar el correo electrónico del candidato.
     - **Teléfono:** Campo de texto para ingresar el número de teléfono del candidato.
     - **Dirección:** Campo de texto para ingresar la dirección del candidato.
     - **Educación:** Campo de texto o selección para ingresar la educación del candidato, con posibilidad de autocompletado.
     - **Experiencia Laboral:** Campo de texto o selección para ingresar la experiencia laboral del candidato, con posibilidad de autocompletado.
     - **CV:** Campo de carga de archivos para subir el CV del candidato en formato PDF o DOCX.

3. **Validación de Datos:**
   - Implementar validaciones para asegurar que los datos ingresados son completos y correctos:
     - **Correo Electrónico:** Validar que el correo tenga un formato válido.
     - **Campos Obligatorios:** Asegurar que los campos de nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral no estén vacíos.
     - **Formato de Archivo:** Validar que el CV cargado sea en formato PDF o DOCX.

4. **Confirmación de Añadido:**
   - Mostrar un mensaje de confirmación al añadir exitosamente un candidato.

5. **Errores y Manejo de Excepciones:**
   - Implementar mensajes adecuados para informar al usuario en caso de errores.

## Ejemplos y Casos de Uso
- Proporciona ejemplos de cómo debería verse la interfaz en dispositivos móviles y de escritorio.
- Incluye casos de uso para la validación de datos y carga de documentos.

## Archivos Necesarios
- Componentes de React para la interfaz del formulario.
- Archivos CSS para el diseño y estilo de la interfaz. 