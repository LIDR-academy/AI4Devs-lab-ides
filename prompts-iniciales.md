# Prompts Iniciales

## Step 0: Meta prompting to Claude

Given the project details I give in the README file, I want you to write the prompts for this User Story:

## User story

Añadir Candidato al Sistema
Como reclutador, Quiero tener la capacidad de añadir candidatos al sistema ATS, Para que pueda gestionar sus datos y procesos de selección de manera eficiente. Criterios de Aceptación:

1. Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
2. Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
3. Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
4. Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
5. Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
6. Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
7. Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
   Notas:

- La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
- Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.
  Tareas Técnicas:
- Implementar la interfaz de usuario para el formulario de añadir candidato.
- Desarrollar el backend necesario para procesar la información ingresada en el formulario.
- Asegurar la seguridad y privacidad de los datos del candidato.

## Considerations

As you can see, there are 3 technical tasks needed for this User Story: the backend development, the frontend and the data base. Due to base project is empty, it will require extra tasks like create the data model, execute PostgreSQL migration, etc.
I want you to define first the 3 working tickets in deep as prompts, so I can use them as input for Zed editor with Claude 3.7 integration.

[Full prompt link here](https://claude.ai/share/674d1275-5187-44dd-8428-b66d25a7e079)

## Ticket 1: Database Model and Migration for Candidate Management

I need to create a Prisma schema for a candidate management system with the following requirements:

1. Create a Candidate model with these fields:

   - id (auto-generated primary key)
   - firstName (required string)
   - lastName (required string)
   - email (required string, unique)
   - phone (optional string)
   - address (optional string)
   - education (array of Education records)
   - experience (array of WorkExperience records)
   - resumeUrl (optional string to store the file path)
   - createdAt (datetime)
   - updatedAt (datetime)

2. Create related models:

   - Education model with fields for institution, degree, fieldOfStudy, startDate, endDate
   - WorkExperience model with fields for company, position, description, startDate, endDate

3. Set up appropriate relationships between these models

4. Create a migration script to initialize the database

5. Include sample seeding data for testing purposes

Please provide the complete Prisma schema and the commands I'll need to run for migration and seeding. The database is PostgreSQL running on Docker as specified in the README.

## Ticket 2: Backend API Development for Candidate Management

I need to develop the backend API for a candidate management system using Express.js, TypeScript, and Prisma ORM. The README shows our project structure has a backend folder with Express and Prisma already set up.

Please implement:

1. A RESTful API endpoint that allows recruiters to add new candidates with the following requirements:

   - POST /api/candidates endpoint
   - Request body validation for required fields (firstName, lastName, email)
   - Email format validation
   - Proper error handling
   - Support for optional fields (phone, address)
   - Ability to create related education and work experience records
   - File upload handling for resume documents (PDF/DOCX)
   - Secure file storage
   - Successful response with the newly created candidate data

2. A GET /api/candidates endpoint to retrieve the list of candidates

3. Include appropriate middleware for:

   - Request validation
   - Error handling
   - File upload processing

4. Proper TypeScript types/interfaces for all request and response objects

5. Unit tests for the API endpoints

Please provide the necessary code files including controllers, routes, middleware, and test files. Explain any dependencies I need to add beyond what's already in the project.

## Ticket 3: Candidate Management System Frontend Development

I need to implement the frontend interface for adding candidates to our recruitment system. According to the README, we're using a React application created with Create React App.

Please implement:

1. A "Add Candidate" button on the recruiter dashboard that's clearly visible

2. A form component with the following fields:

   - First Name (required)
   - Last Name (required)
   - Email (required, with validation)
   - Phone (optional)
   - Address (optional)
   - Education section (optional)
   - Work Experience section (optional)
   - Resume upload (accepting PDF/DOCX files)

3. Form validation that:

   - Ensures required fields are completed
   - Validates email format
   - Provides clear feedback on validation errors

4. Submit functionality that:

   - Sends data to the backend API
   - Shows loading state during submission
   - Handles success with a confirmation message
   - Handles errors with appropriate error messages

5. Responsive design that works across devices

6. Accessibility features (proper labels, ARIA attributes, keyboard navigation)

7. Unit tests for the components

Please provide the React component code, CSS/styling, and any custom hooks needed. Include explanations of any additional libraries I should install (like form validation libraries, UI component libraries, etc.).
