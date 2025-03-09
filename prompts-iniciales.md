# Prompts Iniciales

## Backend

### 1. Modelo en Prisma para un Candidato
Crea un modelo en Prisma para un candidato con los siguientes campos:
- `first_name` (nombre), `last_name` (apellido), `email` (correo electrónico), `phone_number` (teléfono), `address` (dirección), `education` (educación), `work_experience` (experiencia laboral), y `cv` (archivo de tipo PDF o DOCX).
Haz que el `email` sea único, y que el campo `cv` sea opcional.
Asegúrate de que la base de datos sea PostgreSQL.

### 2. Migración de Prisma para el Modelo "Candidate"
Crea la migración de Prisma para el modelo "Candidate" solo si no está creada. Genera la migración para crear la tabla en la base de datos PostgreSQL. Asegúrate de que la migración sea correcta y compatible con PostgreSQL.

### 3. API en Express con TypeScript para Crear un Candidato
Crea una API en Express con TypeScript que exponga un endpoint POST en `/api/candidates/` para crear un nuevo candidato.
La solicitud debe esperar un cuerpo JSON con los campos: `first_name`, `last_name`, `email`, `phone_number`, `address`, `education`, `work_experience` y un archivo `cv` en formato PDF o DOCX.
Asegúrate de manejar la validación de los datos y de que la respuesta sea adecuada (200 OK si el candidato se crea correctamente, 400 en caso de error).

### 4. Configuración de Prisma en un Proyecto Express
Configura Prisma en un proyecto Express utilizando PostgreSQL. Asegúrate de que se conecte correctamente a la base de datos usando los detalles del archivo `.env` y que la conexión funcione para las migraciones y operaciones de base de datos.

### 5. Manejo de Errores en la API de Candidatos
Añade manejo de errores adecuado en la API de candidatos en Express. Si la solicitud contiene datos incorrectos (por ejemplo, un formato de correo no válido o un archivo de CV que no sea PDF o DOCX), devuelve un mensaje de error con un código HTTP 400.

---

## Frontend

### 1. Formulario en React para Añadir un Candidato
Crea un formulario en React para añadir un nuevo candidato con los siguientes campos:
- `first_name`, `last_name`, `email`, `phone_number`, `address`, `education`, `work_experience` y un campo para cargar el archivo `cv` (en formato PDF o DOCX).
Asegúrate de que todos los campos sean obligatorios, excepto el campo de archivo de CV. Usa `react-hook-form` para manejar el formulario de manera eficiente.

### 2. Campo de Carga de Archivo en React
Implementa un campo de carga de archivo en el formulario React donde los reclutadores puedan subir un CV en formato PDF o DOCX. Asegúrate de que el archivo sea validado para aceptar solo esos formatos antes de ser enviado al backend.

### 3. Envío de Datos del Formulario a la API
Escribe el código en React para capturar los datos del formulario y enviarlos a la API Express de creación de candidatos. Usa `fetch` para hacer una petición POST a `/api/candidates/` con los datos del formulario y el archivo de CV.
Muestra un mensaje de éxito si la creación fue exitosa, o un mensaje de error si algo salió mal.

### 4. Manejo de Respuestas de la API en React
En el frontend de React, después de enviar el formulario, maneja la respuesta de la API Express. Si el candidato se crea exitosamente, muestra un mensaje de éxito. Si hay un error (por ejemplo, un correo electrónico duplicado), muestra un mensaje de error con la razón.

---

## Base de Datos y Docker

### 1. Configuración de Docker Compose para PostgreSQL
Asegúrate de que Docker Compose esté configurado correctamente para iniciar un contenedor de PostgreSQL. Usa el archivo `.env` para almacenar las credenciales de la base de datos (usuario, contraseña, nombre de base de datos). Verifica que PostgreSQL esté corriendo en `localhost:5432` y que el backend pueda conectarse correctamente a la base de datos.

---

## Manejo de Excepciones y Seguridad

### 1. Middleware de Seguridad en Express
Añade middleware de seguridad en Express para proteger las rutas de la API (como la de `/api/candidates/`) de solicitudes maliciosas, como la inyección SQL. Usa una librería como `helmet` y configura una validación adecuada para los datos que se reciben en el backend, especialmente el archivo de CV.

### 2. Middleware Global para Manejo de Errores
Crea un middleware global en Express para manejar errores no capturados, como fallos de conexión a la base de datos o problemas con la carga de archivos. Si ocurre un error, devuelve una respuesta adecuada con un código de error y un mensaje explicativo.

---

## Diseño de UI/UX

### 1. Formulario de Registro de Candidatos con Diseño Premium
Diseña un formulario de registro de candidatos en React que tenga una apariencia premium y futurista con efectos visuales avanzados y una experiencia de usuario excepcional.

#### Características visuales y de usabilidad:
- **Diseño de alto nivel con Neumorfismo o Glassmorphism**: Usa shadcn/ui, Material UI, Tailwind CSS, o Chakra UI para lograr una apariencia sofisticada y moderna.
- **Animaciones con Framer Motion**: Agrega transiciones suaves, efectos hover y microinteracciones que hagan la UI más fluida y dinámica.
- **Modo Oscuro/Claro automático**: La UI debe adaptarse al tema del sistema del usuario con animaciones suaves al cambiar de modo.
- **Validaciones con efectos premium**:
  - Cuando haya un error, el campo debe vibrar suavemente y mostrar un mensaje flotante animado.
  - Resalta los errores con un brillo o glow animado en los bordes en vez de un simple color rojo.
  - Usa iconos dinámicos (como un ✖️ que se convierte en un ✅ al corregir un campo).
- **Drag & Drop avanzado para subir archivos**:
  - Implementa una zona de arrastre estilizada para subir el CV, con animaciones y una previsualización.
  - Los archivos incorrectos deben mostrar un efecto de "rebote" y un mensaje flotante atractivo.
- **Botón de envío ultra visual**:
  - Cuando el usuario haga clic, el botón debe mostrar un efecto de onda o pulsación, y si la solicitud es exitosa, cambiar de color automáticamente.
- **Feedback de éxito ultra atractivo**:
  - Usa una notificación animada elegante con confeti virtual o un check flotante animado al agregar un candidato con éxito.
- **Tipografías y colores impactantes**: Usa una combinación de tipografías modernas y degradados sutiles para lograr un look más premium.
- **Interfaz adaptada a dispositivos móviles**:
  - Usa un menú flotante o bottom navigation en móviles para mejorar la navegación.
  - Implementa gestos táctiles, como deslizar para descartar errores o cerrar modales.
- **Background dinámico**: Agrega un fondo con partículas animadas, degradados en movimiento o un efecto sutil de parallax.

### 2. Validación de Número de Teléfono en React con TypeScript
Implementa una validación de número de teléfono en React con TypeScript, utilizando una expresión regular avanzada y una experiencia de usuario moderna.

#### Requisitos:
- Soporte para múltiples formatos internacionales, permitiendo números con o sin código de país.
- Si el número es inválido, debe mostrarse un mensaje de error animado con un icono de advertencia.
- Autocompletar y formateo automático: Usa una librería como `libphonenumber-js` o `react-phone-input-2` para formatear y validar en tiempo real.
- Resaltar errores visualmente con bordes en rojo con efecto glow y un tooltip con el mensaje de error.
- Feedback positivo cuando el número es correcto, cambiando el borde a verde con un icono de check ✅ animado.
- Compatibilidad con dispositivos móviles, asegurando una buena experiencia de usuario en pantallas táctiles.
- Soporte para input con código de país (+1, +34, etc.), con un dropdown de selección estilizado.