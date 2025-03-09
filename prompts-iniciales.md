Herramientas utilizadas: 
- ChatGPT para la definición de los prompts (se ha partido de ellos, se han revisado y se han editado/completado)
- Cursor con claude 3.7 sonnet

# Ticket 1 - Definición de modelo de datos
### Contexto
Voy a desarrollar una funcionalidad para añadir candidatos al sistema ATS (Applicant Tracking System). Necesito crear una base de datos para almacenar la información de los candidatos, incluyendo sus datos personales, su historial educativo, experiencia laboral y los archivos adjuntos (CV). La base de datos debe ser segura, bien estructurada, fácil de acceder y compatible con un backend que procese las solicitudes de inserción de candidatos.

Hay que tener en cuenta que debemos utilizar PRISMA, tal cual se está utilizando en el proyecto.

### Requerimientos de la base de datos:

#### Tablas principales:

- Candidatos: Para almacenar información básica de los candidatos.
- Educación: Para almacenar información sobre la educación del candidato.
- ExperienciaLaboral: Para almacenar información sobre la experiencia laboral del candidato.
- Documentos: Para almacenar los archivos adjuntos (CV) de los candidatos.

#### Estructura de la tabla Candidatos:

- id (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único para el candidato.
- nombre (VARCHAR(100)): Nombre del candidato.
- apellido (VARCHAR(100)): Apellido del candidato.
- email (VARCHAR(255)): Correo electrónico del candidato (debe ser único).
- telefono (VARCHAR(15)): Número de teléfono.
- direccion (TEXT): Dirección del candidato.
- fecha_creacion (DATETIME): Fecha en que se registró el candidato.
- fecha_actualizacion (DATETIME): Fecha de la última actualización de los datos del candidato.

#### Estructura de la tabla Educación:

- id (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único.
- candidato_id (INT, FOREIGN KEY): Relación con la tabla "Candidatos".
- institucion (VARCHAR(255)): Nombre de la institución educativa.
- titulo (VARCHAR(255)): Título obtenido (por ejemplo, Licenciado en Psicología).
- fecha_inicio (DATE): Fecha de inicio de los estudios.
- fecha_fin (DATE): Fecha de finalización de los estudios (si aplica).

#### Estructura de la tabla ExperienciaLaboral:

- id (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único.
- candidato_id (INT, FOREIGN KEY): Relación con la tabla "Candidatos".
- empresa (VARCHAR(255)): Nombre de la empresa donde trabajó el candidato.
- puesto (VARCHAR(255)): Puesto desempeñado.
- fecha_inicio (DATE): Fecha de inicio del empleo.
- fecha_fin (DATE): Fecha de finalización del empleo (si aplica).
- descripcion (TEXT): Descripción de las responsabilidades y logros.

#### Estructura de la tabla Documentos:

- id (INT, PRIMARY KEY, AUTO_INCREMENT): Identificador único.
- candidato_id (INT, FOREIGN KEY): Relación con la tabla "Candidatos".
- tipo_documento (VARCHAR(50)): Tipo de documento (por ejemplo, "CV").
- nombre_archivo (VARCHAR(255)): Nombre del archivo cargado (por ejemplo, "CV_Juan_Perez.pdf").
- ruta_archivo (VARCHAR(255)): Ruta del archivo en el servidor o almacenamiento en la nube.
- fecha_subida (DATETIME): Fecha en la que el archivo fue cargado.

#### Relaciones:

- Un candidato puede tener múltiples registros en la tabla de "Educación", "ExperienciaLaboral" y "Documentos". Cada uno de estos debe estar vinculado a un único candidato mediante el campo candidato_id.
Requisitos de Seguridad:

Asegurarse de que todos los datos sensibles, como el correo electrónico y teléfono del candidato, se almacenen de manera segura.
Implementar medidas para encriptar la información si es necesario, especialmente en los casos de autenticación o accesos a datos privados.

#### Validación de datos:

Los campos obligatorios en la tabla "Candidatos" son: nombre, apellido, correo electrónico, teléfono.
El correo electrónico debe ser único.
Asegurarse de que los archivos adjuntos (CV) sean de tipo PDF o DOCX y no superen un límite de tamaño predefinido (por ejemplo, 5 MB).
Manejo de errores y excepciones:

En caso de un fallo en el proceso de inserción de datos (por ejemplo, si falta información obligatoria o hay un error de conexión), el sistema debe devolver un mensaje adecuado.

## Tareas para Cursor:

- Crear las tablas mencionadas anteriormente (Candidatos, Educación, ExperienciaLaboral, Documentos) con las relaciones adecuadas.
- Proporcionar la estructura de la base de datos en SQL.
- Asegurarse de que la base de datos sea escalable y permita la integración con el backend para el proceso de inserción de candidatos.
- Incluir ejemplos de cómo insertar, actualizar y consultar registros en las tablas.

# Ticket 2 - Desarrollo Back

## Contexto
Estamos desarrollando un sistema ATS (Applicant Tracking System) que permita a los reclutadores añadir candidatos a la base de datos de forma eficiente y segura. Este backend debe ser capaz de procesar la información enviada desde un formulario frontend, realizar validaciones, almacenar los datos en una base de datos y manejar la carga de documentos (CV) en formatos PDF o DOCX.
Vamos a realizar únicamente las tareas de backend.

## Requerimientos Técnicos
Lenguaje y Framework: el utilizado en el proyecto.
Base de datos: PostgreSQL (la utilizada en el proyecto).
Archivos Adjuntos: Los reclutadores deben poder cargar archivos CV en formatos PDF o DOCX.

### Endpoints API
### Crear Candidato
- Método: POST
- Endpoint: /api/candidatos

- Descripción: Este endpoint permite crear un nuevo candidato en el sistema. Recibe un formulario con los datos del candidato y los almacena en la base de datos.

##### Cuerpo de la solicitud (JSON):

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@email.com",
  "telefono": "+34912345678",
  "direccion": "Calle Ficticia 123, Ciudad",
  "educacion": [
    {
      "institucion": "Universidad de Madrid",
      "titulo": "Licenciado en Psicología",
      "fecha_inicio": "2015-09-01",
      "fecha_fin": "2019-06-30"
    }
  ],
  "experiencia_laboral": [
    {
      "empresa": "Empresa XYZ",
      "puesto": "Psicólogo Clínico",
      "fecha_inicio": "2020-01-01",
      "fecha_fin": "2023-01-01",
      "descripcion": "Atención a pacientes, diagnóstico y seguimiento."
    }
  ]
}
```

##### Respuesta (201 - Created):

```json
{
  "message": "Candidato añadido exitosamente.",
  "id_candidato": 12345
}
```

##### Validaciones:

- Verificar que todos los campos obligatorios (nombre, apellido, email, teléfono) estén presentes.
- El correo electrónico debe ser único en la base de datos.
- Las fechas deben tener un formato correcto (YYYY-MM-DD).
- Los campos educacion y experiencia_laboral son opcionales, pero si están presentes deben seguir un formato válido.

### Subir CV de Candidato
- Método: POST
- Endpoint: /api/candidatos/{id_candidato}/documentos

- Descripción: Este endpoint permite cargar el CV de un candidato en formato PDF o DOCX. El archivo se guarda en el servidor o en almacenamiento en la nube.

## Cuerpo de la solicitud (form-data):

- archivo: El archivo del CV (PDF o DOCX).
- Respuesta (200 - OK):

```json
{
  "message": "CV cargado exitosamente.",
  "nombre_archivo": "CV_Juan_Perez.pdf",
  "ruta_archivo": "/storage/cv/juan_perez.pdf"
}
```
##Validaciones:

- El archivo debe ser de tipo PDF o DOCX.
- El tamaño máximo del archivo debe ser 5MB.
- Si el archivo se carga exitosamente, debe ser vinculado al candidato correspondiente.

### Obtener Candidato por ID
- Método: GET
- Endpoint: /api/candidatos/{id_candidato}

- Descripción: Este endpoint permite obtener los datos de un candidato específico, incluyendo su información personal, educación, experiencia laboral y documentos.

##### Respuesta (200 - OK):
```json
{
  "id": 12345,
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@email.com",
  "telefono": "+34912345678",
  "direccion": "Calle Ficticia 123, Ciudad",
  "educacion": [
    {
      "institucion": "Universidad de Madrid",
      "titulo": "Licenciado en Psicología",
      "fecha_inicio": "2015-09-01",
      "fecha_fin": "2019-06-30"
    }
  ],
  "experiencia_laboral": [
    {
      "empresa": "Empresa XYZ",
      "puesto": "Psicólogo Clínico",
      "fecha_inicio": "2020-01-01",
      "fecha_fin": "2023-01-01",
      "descripcion": "Atención a pacientes, diagnóstico y seguimiento."
    }
  ],
  "documentos": [
    {
      "tipo_documento": "CV",
      "nombre_archivo": "CV_Juan_Perez.pdf",
      "ruta_archivo": "/storage/cv/juan_perez.pdf"
    }
  ]
}
```

### Manejo de Errores y Excepciones
Para cada uno de los endpoints anteriores, el backend debe manejar errores y excepciones como:

- 400 - Bad Request: Cuando los datos enviados en el formulario son inválidos o incompletos.
- 404 - Not Found: Cuando no se encuentra un candidato con el ID especificado.
- 500 - Internal Server Error: Cuando se produce un error en el servidor (por ejemplo, problemas con la base de datos).

# Ticket 3 - Desarrollo Front

## Contexto
Estamos desarrollando un sistema ATS (Applicant Tracking System) que permita a los reclutadores añadir candidatos de manera eficiente. El frontend debe proporcionar una interfaz fácil de usar que permita a los reclutadores completar un formulario para agregar candidatos, cargar documentos (CV) y visualizar los mensajes de confirmación o error.
Vamos a realizar únicamente las tareas de frontend.

## Requerimientos Técnicos

1. **Tecnologías**: Utilizar **React** para el frontend, con soporte para formularios dinámicos y validaciones.
2. **Interfaz de usuario**:
   - Formulario intuitivo para añadir candidatos.
   - Validaciones de campos en tiempo real.
   - Opciones para cargar documentos (CV).
   - Mensajes de confirmación y error.
3. **Estilo**: Utilizar **CSS** o **SASS** para la estilización, asegurando que la interfaz sea accesible y responsiva.

## Componentes Frontend

### 1. **Formulario de Añadir Candidato**

**Ruta del componente**: `/components/FormularioCandidato.js`

#### Campos del formulario:
- **Nombre** (campo obligatorio)
- **Apellido** (campo obligatorio)
- **Email** (campo obligatorio, debe ser único)
- **Teléfono** (campo obligatorio)
- **Dirección** (campo opcional)
- **Educación** (campo opcional, permite agregar múltiples entradas)
- **Experiencia laboral** (campo opcional, permite agregar múltiples entradas)
- **Archivo CV** (campo obligatorio para subir el CV en formato PDF o DOCX)

#### Validaciones:
- Los campos **Nombre**, **Apellido**, **Email**, y **Teléfono** son obligatorios.
- El campo **Email** debe ser validado como un formato correcto y debe ser único.
- El campo **Teléfono** debe tener un formato de número válido.
- El **CV** solo debe aceptar archivos en formato PDF o DOCX y no puede superar un tamaño de 5MB.


### 2. **Mostrar Candidatos Existentes**

**Ruta del componente**: `/components/ListaCandidatos.js`

#### Funcionalidad:
- Obtener la lista de candidatos desde el backend (usando `GET /api/candidatos`).
- Mostrar los detalles básicos de cada candidato (nombre, apellido, correo electrónico, teléfono).
- Cada candidato debe tener un enlace o botón para ver más detalles.


### 3. **Carga de Archivos (CV)**

**Ruta del componente**: `/components/CargarCV.js`

Este componente es parte del formulario de candidato, donde el reclutador puede seleccionar y cargar el archivo del CV.

**Funcionalidad**:
- Asegurarse de que el archivo cargado esté en formato PDF o DOCX.
- Validar que el tamaño del archivo no supere 5MB.
- Mostrar un mensaje de error si el archivo no es válido o es demasiado grande.

### 4. **Estilización y Diseño Responsivo**

Usa **CSS** o **SASS** para estilizar los componentes y asegurarte de que la interfaz sea accesible y responsiva en diferentes dispositivos. La interfaz debe incluir:
- Formularios con márgenes y padding adecuados.
- Botones de acción visibles y fáciles de presionar.
- Mensajes de error resaltados en rojo.
- Diseño responsivo para que la interfaz se adapte bien a dispositivos móviles.

## Integración con el Backend

- El frontend debe enviar las solicitudes al backend usando `axios` o `fetch`.
- Utiliza `POST` para añadir nuevos candidatos y `GET` para obtener los candidatos existentes.

## Requisitos de Accesibilidad

- Todos los formularios deben tener etiquetas `aria` adecuadas para ser accesibles a personas con discapacidades.
- Asegúrate de que el diseño sea claro y fácil de navegar usando un teclado.

# Correcciones

## Prompt 1
Vamos a iterar para ir añadiendo algunas cuestiones:
- En la pantalla de inicio, no aparece un botón para añadir candidatos que enlace con el formulario. Añádelo.
- Documenta el API para tenerlo disponible una manera fácil de ver su información. Utiliza la herramienta más utilizada en el mercado o la que creas que es la mejor.

## Prompt 2
Vamos a implementar un endpoint que devuelva los candidatos de la base de datos y a mostrarlo en la pantalla de candidatos ya que ahora se muestra el 404 y debe ser debido a que no existe el endpoint

## Prompt 3
Vamos a corregir los siguientes puntos:
- La pantalla de visualización de un candidato no carga correctamente. Sale la pantalla en blanco.
- El formato del teléfono solicita 10 dígitos, cuando deben ser nueve.
- Cuando el back no responde, se está mostrando mucho detalle al usuario que no le interesa, solo hay que indicar que el sistema no funciona correctamente.
- Los documentos PDF que se suben, deben excluirse el git

## Prompt 4
Vamos a realizar una nueva mejora. Al guardar un candidato, debería aparecer en pantalla un loading que indique al usuario que la aplicación está realizando una acción.
Una vez creado el usuario, cuando volvamos a la pantalla con el listado de candidatos, se debe indicar de alguna, temporal, un mensaje que diga que se ha creado un candidato.