Ticket 1: Crear Modelo de Datos y Migración en PostgreSQL para Candidatos
##########################################################################
Descripción:
Se debe definir y crear el modelo de datos para almacenar la información de los candidatos en el sistema ATS. Esto incluirá los campos necesarios para la información personal, educación, experiencia laboral y la ruta del archivo del CV. Además, se debe generar la migración correspondiente para que la base de datos PostgreSQL se configure correctamente.

Criterios de Aceptación:

- Se debe crear un modelo (por ejemplo, Candidato) con los siguientes campos:
    - id: identificador único (PK, auto incremental o UUID).
    - nombre: texto, obligatorio.
    - apellido: texto, obligatorio.
    - correo_electronico: texto, obligatorio, único y con formato válido.
    - telefono: texto (opcional o obligatorio, según requisitos).
    - direccion: texto.
    - educacion: campo que almacene información de educación (puede ser texto, JSON o relacionarse con otra tabla).
    - experiencia_laboral: campo que almacene la experiencia (texto, JSON o mediante tabla relacional).
    - cv_path: texto, para almacenar la ruta o URL del archivo subido.
    - Timestamps (por ejemplo, created_at y updated_at).
- La migración debe ejecutarse sin errores y reflejar la estructura definida en la base de datos PostgreSQL.
- Documentar cualquier decisión de normalización (por ejemplo, separar educación y experiencia en tablas relacionadas, si se estima necesario).

Tareas Técnicas:

1. Diseñar el modelo de datos para candidatos.
2. Crear el archivo de migración (por ejemplo, usando Prisma Migrate, Sequelize, TypeORM u otra herramienta).
3. Ejecutar la migración en el entorno de desarrollo y verificar la creación correcta de la tabla.
4. Documentar las decisiones de diseño y validar las restricciones a nivel de base de datos.

Notas:

- Considerar la posibilidad de reutilizar estructuras o relaciones para campos complejos como educación y experiencia.
- Asegurarse de que las validaciones a nivel de base de datos (unicidad, no nulos, etc.) estén bien definidas.

Ticket 2: Desarrollar API Backend para Añadir Candidato
#######################################################
Descripción:
Desarrollar un endpoint en el backend que permita a los reclutadores añadir nuevos candidatos al sistema. Este servicio debe recibir los datos del candidato (incluyendo la carga del CV) y procesarlos para almacenarlos en la base de datos, validando la entrada y manejando errores de forma adecuada.

Criterios de Aceptación:

- Se debe exponer un endpoint HTTP (por ejemplo, POST /candidatos) para recibir los datos del candidato.
- El endpoint debe validar los datos entrantes, asegurándose de que los campos obligatorios (nombre, apellido, correo electrónico, etc.) estén completos y sean correctos (ej., formato válido de email).
- Debe incluir funcionalidad para la carga de archivos (CV en PDF o DOCX) y almacenar la referencia (ruta o URL) del archivo.
- En caso de éxito, se retornará un mensaje de confirmación junto con los datos del candidato creado.
- En caso de error (datos inválidos, problemas de conexión, etc.), se retornará un mensaje de error claro y adecuado.
- El endpoint debe estar protegido (por ejemplo, mediante autenticación JWT) para que solo usuarios autorizados (reclutadores) puedan usarlo.

Tareas Técnicas:

1. Crear el endpoint POST /candidatos en el backend.
2. Implementar la validación de datos de entrada y manejo de errores.
3. Integrar un middleware para la carga de archivos (por ejemplo, Multer) para procesar el CV.
4. Conectar el endpoint con el modelo de datos (Ticket 1) y asegurar la persistencia en la base de datos.
5. Implementar pruebas unitarias y de integración para el endpoint.
6. Documentar la API (por ejemplo, usando Swagger o similar).

Notas:

- Considerar la seguridad de la información y el cumplimiento de normativas sobre privacidad.
- Registrar logs relevantes para el seguimiento de la actividad del endpoint.

Ticket 3: Implementar Interfaz de Usuario para Añadir Candidato (Frontend)
##########################################################################
Descripción:
Desarrollar la interfaz de usuario para que los reclutadores puedan añadir candidatos al sistema ATS. La UI debe ser intuitiva, accesible y compatible con múltiples dispositivos y navegadores.

Criterios de Aceptación:

- Desde el dashboard principal, debe existir un botón o enlace visible para acceder al formulario de “Añadir Candidato”.
- Al hacer clic, se debe mostrar un formulario que incluya los siguientes campos:
    - Nombre, Apellido, Correo electrónico, Teléfono, Dirección.
    - Educación y Experiencia Laboral (con opción de autocompletar a partir de datos preexistentes en el sistema).
    - Opción para cargar el CV (formatos PDF o DOCX).
- El formulario debe realizar validaciones en el cliente (por ejemplo, formato del email, campos obligatorios, etc.).
- Tras enviar el formulario, debe mostrarse un mensaje de confirmación de que el candidato fue añadido exitosamente.
- En caso de error, se debe mostrar un mensaje claro al usuario.
- La interfaz debe ser responsiva y seguir buenas prácticas de accesibilidad (por ejemplo, compatibilidad con lectores de pantalla y navegación por teclado).

Tareas Técnicas:

1. Diseñar y desarrollar la vista/formulario de “Añadir Candidato” utilizando la tecnología frontend definida (React, Angular, Vue, etc.).
2. Implementar las validaciones de formulario (usando librerías o validación personalizada).
3. Configurar la funcionalidad para la carga de archivos (integración con un componente de subida).
4. Conectar la UI con el endpoint del backend (Ticket 2) mediante llamadas HTTP (por ejemplo, usando fetch o axios).
5. Implementar mensajes de éxito y manejo de errores en la interfaz.
6. Realizar pruebas de usabilidad y compatibilidad en diferentes navegadores y dispositivos.

Notas:

- Considerar mejorar la experiencia del usuario con funcionalidades de autocompletado en campos de educación y experiencia.
- Diseñar la UI siguiendo las guías de estilo y accesibilidad corporativas.