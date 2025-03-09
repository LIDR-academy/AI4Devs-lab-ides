# Prompt Backend

Add to ChatCtrl+I
Ctrl+K to generate a command
**Prompt para Cursor IDE - Implementación del Backend para "Añadir Candidato al Sistema"**

**Contexto:**
Este prompt está diseñado para que el IDE Cursor genere el código necesario para implementar la funcionalidad de "Añadir Candidato al Sistema" en el backend de un ATS (Applicant Tracking System). La implementación debe asegurar validaciones, seguridad, almacenamiento eficiente y compatibilidad con PostgreSQL mediante Prisma ORM.

**Requerimientos Generales:**
- Exponer un endpoint POST `/candidatos` para recibir los datos del formulario.
- Validar los datos recibidos, asegurando que los campos requeridos sean correctos y estén completos.
- Gestionar la persistencia en PostgreSQL usando Prisma ORM.
- Manejar la carga y almacenamiento de documentos en el disco del servidor.
- Implementar manejo de errores y respuestas adecuadas.
- Asegurar la seguridad de los datos y autenticación de usuarios.
- Registrar logs de eventos relevantes.

### **Tareas de Implementación:**

### **1. Configuración del Servidor y Base de Datos**
1. Configurar un servidor Express en Node.js.
2. Configurar Prisma como ORM y realizar la conexión con PostgreSQL.
3. Crear migraciones para la tabla `candidatos` con los siguientes campos:
   - `id` (UUID, Primary Key)
   - `nombre` (String, Obligatorio)
   - `apellido` (String, Obligatorio)
   - `email` (String, Único, Obligatorio, Validación de formato)
   - `telefono` (String, Opcional)
   - `direccion` (String, Opcional)
   - `educacion` (String, Obligatorio)
   - `experiencia` (String, Obligatorio)
   - `cv_path` (String, Ruta del archivo en disco, Opcional)
   - `createdAt` (Timestamp, Auto generado)
   - `updatedAt` (Timestamp, Auto actualizado)

### **2. Implementación del Endpoint REST**
1. Crear el endpoint POST `/candidatos` para recibir datos del formulario.
2. Validar los datos recibidos:
   - Campos obligatorios presentes y correctos.
   - Email con formato válido y único en la base de datos.
3. Procesar la carga de archivos:
   - Aceptar solo PDF y DOCX.
   - Guardar el archivo en una carpeta del servidor (`uploads/cv/`).
   - Generar un nombre único para el archivo para evitar colisiones.
   - Registrar la ruta del archivo en la base de datos.
4. Guardar la información en PostgreSQL usando Prisma.
5. Retornar una respuesta JSON con el estado de la operación.

### **3. Seguridad y Manejo de Errores**
1. Implementar autenticación mediante JWT o middleware de seguridad.
2. Sanitizar y validar datos para prevenir inyecciones SQL o XSS.
3. Manejo de errores con respuestas adecuadas:
   - `400` para datos inválidos.
   - `409` para emails duplicados.
   - `500` para errores internos.
4. Registrar logs de eventos importantes para auditoría.

### **4. Documentación y Configuración**
1. Escribir documentación en Swagger o Postman para el endpoint `/candidatos`.
2. Incluir ejemplos de requests y responses.
3. Actualizar el archivo `README.md` con detalles sobre:
   - Endpoints disponibles.
   - Requisitos y configuración del entorno.
   - Instrucciones para correr migraciones de Prisma.
   - Ubicación y configuración del almacenamiento de archivos.

# Prompt Frontend
**Prompt para Cursor IDE - Implementación del Frontend para "Añadir Candidato al Sistema"**

**Contexto:**
Este prompt está diseñado para que el IDE Cursor genere el código necesario para implementar la funcionalidad de "Añadir Candidato al Sistema" en el frontend de un ATS (Applicant Tracking System). La interfaz debe ser intuitiva, responsiva y accesible, utilizando React con Tailwind CSS.

**Requerimientos Generales:**
- Se debe agregar un botón visible en el dashboard del reclutador para añadir un candidato.
- Al hacer clic, se debe mostrar un formulario en un modal o una nueva página.
- El formulario debe incluir los siguientes campos:
  - Nombre (Obligatorio)
  - Apellido (Obligatorio)
  - Correo Electrónico (Formato válido, Obligatorio)
  - Teléfono (Opcional)
  - Dirección (Opcional)
  - Educación (Autocompletado basado en datos preexistentes, Obligatorio)
  - Experiencia Laboral (Autocompletado basado en datos preexistentes, Obligatorio)
  - Carga de CV en formato PDF o DOCX
- Validaciones en tiempo real:
  - Verificar que los campos obligatorios estén completos.
  - Validar formato de email.
  - Restringir el tipo de archivo a PDF o DOCX.
- Mostrar mensajes de error si hay problemas con la validación o la conexión con el backend.
- Confirmación visual tras agregar un candidato exitosamente.
- Asegurar compatibilidad con dispositivos móviles y navegadores modernos.

### **Tareas de Implementación:**

### **1. Creación del Componente UI**
1. Agregar un botón en el dashboard con el texto "Añadir Candidato".
2. Implementar un modal o una página nueva con el formulario.
3. Utilizar Tailwind CSS para un diseño limpio y accesible.

### **2. Validaciones y Manejo de Errores**
1. Implementar validaciones en los campos del formulario.
2. Manejar errores de entrada en tiempo real.
3. Mostrar mensajes claros en caso de errores en la conexión con el backend.

### **3. Integración con el Backend**
1. Enviar los datos del formulario al endpoint POST `/candidatos`.
2. Adjuntar el CV utilizando `FormData` para manejar archivos.
3. Mostrar una animación de carga mientras se procesa la petición.
4. Mostrar un mensaje de éxito si el candidato se agrega correctamente.

### **4. Accesibilidad y Responsividad**
1. Garantizar compatibilidad con pantallas móviles y tabletas.
2. Asegurar que el formulario sea navegable con teclado.
3. Implementar etiquetas y atributos accesibles (`aria-labels`, `tabindex`, etc.).

### **5. Documentación y Configuración**
1. Documentar la estructura y props de los componentes.
2. Explicar cómo integrar el componente en el dashboard.
3. Actualizar el archivo `README.md` con instrucciones sobre la funcionalidad y uso del formulario.


