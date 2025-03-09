# Prompts Log

This file tracks prompts used with AI assistants and code-generation tools throughout the project.

## Format

Each entry should include:
- Date: When the prompt was created (format: YYYY-MM-DD HH:MM)
- Prompt: The text of the prompt used
- Purpose: What the prompt was intended to achieve
- Outcome: Summary of the response or generated content
- Files: List of files created or modified based on the prompt

## Prompts

### [2024-03-08 14:30] Initial Documentation Setup

**Prompt:**
```
Let's create a new cursor rules file for this project
```

**Purpose:**
Set up the project's configuration and documentation structure following best practices.

**Outcome:**
Created the initial `.cursor` file with editor settings, then restructured to use `.cursor/rules` with a `robust-typescript-development.mdc` file. Also set up a documentation structure with templates for tracking prompts and user stories.

**Files:**
- `.cursor` - Editor configuration file
- `.cursor/rules/robust-typescript-development.mdc` - Development standards for the project
- `docs/prompts.md` - This file for tracking AI prompts
- `docs/user-stories.md` - File for tracking user stories

### [2024-03-08 15:00] User Story Documentation

**Prompt:**
```
Let's start by editing the user story file, this is the current user story:

Añadir Candidato al Sistema
Como reclutador,
Quiero tener la capacidad de añadir candidatos al sistema ATS,
Para que pueda gestionar sus datos y procesos de selección de manera eficiente.

Criterios de Aceptación:

Accesibilidad de la función: Debe haber un botón o enlace claramente visible para añadir un nuevo candidato desde la página principal del dashboard del reclutador.
Formulario de ingreso de datos: Al seleccionar la opción de añadir candidato, se debe presentar un formulario que incluya los campos necesarios para capturar la información del candidato como nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral.
Validación de datos: El formulario debe validar los datos ingresados para asegurar que son completos y correctos. Por ejemplo, el correo electrónico debe tener un formato válido y los campos obligatorios no deben estar vacíos.
Carga de documentos: El reclutador debe tener la opción de cargar el CV del candidato en formato PDF o DOCX.
Confirmación de añadido: Una vez completado el formulario y enviada la información, debe aparecer un mensaje de confirmación indicando que el candidato ha sido añadido exitosamente al sistema.
Errores y manejo de excepciones: En caso de error (por ejemplo, fallo en la conexión con el servidor), el sistema debe mostrar un mensaje adecuado al usuario para informarle del problema.
Accesibilidad y compatibilidad: La funcionalidad debe ser accesible y compatible con diferentes dispositivos y navegadores web.
Notas:

La interfaz debe ser intuitiva y fácil de usar para minimizar el tiempo de entrenamiento necesario para los nuevos reclutadores.
Considerar la posibilidad de integrar funcionalidades de autocompletado para los campos de educación y experiencia laboral, basados en datos preexistentes en el sistema.
Tareas Técnicas:

Implementar la interfaz de usuario para el formulario de añadir candidato.
Desarrollar el backend necesario para procesar la información ingresada en el formulario.
Asegurar la seguridad y privacidad de los datos del candidato.
```

**Purpose:**
Document the user story for adding a candidate to the ATS system in the appropriate format.

**Outcome:**
Created a structured user story entry in the user-stories.md file, including description, acceptance criteria, notes, and technical tasks.

**Files:**
- `docs/user-stories.md` - Updated with the "Añadir Candidato al Sistema" user story

### [2024-03-08 15:10] Documentation Format Updates

**Prompt:**
```
We will implement 2 updates to these files, for user stories we will not include Status, Priority, Estimate or Assigned To, and for prompts, we will include the hour and the, minute of the change
```

**Purpose:**
Refine the documentation format for both user stories and prompts files.

**Outcome:**
Updated the format of both documentation files - removed project management fields from user stories and added time information to prompt entries.

**Files:**
- `docs/user-stories.md` - Removed Status, Priority, Estimate, and Assigned To fields
- `docs/prompts.md` - Added hour and minute to the date format

### [2024-03-08 15:20] Task Breakdown Preparation

**Prompt:**
```
Excelent, now i want you to help me understand the user story and the 3 thecnical task, it's important that you keep a constant feedback with me so we can define all the subtasks and the specifics from each one, ask me all the relevant questions you need, this tasks will be stored in a new file called tasks.md inside the docs folder, the idea is to not let anything to the imagination before implementing the solution
```

**Purpose:**
Break down the technical tasks into detailed, actionable subtasks and clarify all implementation details.

**Outcome:**
Created a new tasks.md file with the initial structure for task breakdown. Started asking clarifying questions about the candidate data model, frontend interface, backend implementation, and security requirements.

**Files:**
- `docs/tasks.md` - Created with initial structure for task breakdown

### [2024-03-08 15:35] Task Requirements Specification

**Prompt:**
```
Answers:

## UI Framework and design

- UI framwork: Tailwind + shadcn
- Not an specific design system
- Multi-step wizard

## Candidate Fields

Besides the already defined:

- Desired Salaray
- Languages
- Skills

## Education

- Multiple entries with dates
- Institution, Degree, Dates, Quick summary (optional)
- Company, position, dates, Quick summary (optional)

## File upload

- Use a recommended file size for this
- Yes, preview the files
- Just 1 CV (it can be updated)
- We need to implement a way to exctract the data from the LinkedIn generated PDF in order to extract the data (we can discuss this feature after this section)

## API Design

- Use REST
- Use JSON
- Return the message in a i18n format

## Database

- No schema created
- Many to many relationship for files
- Use soft deletes

## File Storage

- Database
- Naming convention: CV_{email}_{timestamp}.{pdf}
- No specific policies

## Auth

- Basic login system with JWT
- The API allows CORS so we can implement a future mobile system connection (not implemented yet)
- Yes, use a RBAC with 2 possible roles (Admin, Candidates)
- Admin has full control of the app, including the ability to see the content of all the users
- Candidates can only submit, view, edit and delete their own content

## Data protection

- Follow GDPR
- No special handling for data
- Not encrypted, but the passwords must be hashed using standard security measures

## Security

- Standard validation and sanitization
- Validate only PDFs to be allowed
- Yes add a comprehensive and extensive logging system, we need to be able to audit every process, including error handling, use file logging

Feel free to ask anything at any moment and remember to update the prompts and tasks when needed
```

**Purpose:**
Gather detailed specifications for each aspect of the user story implementation.

**Outcome:**
Received comprehensive answers about UI framework, fields, education/experience structure, file handling, API design, database structure, auth system, data protection, and security requirements.

**Files:**
- `docs/tasks.md` - To be updated with detailed task breakdown based on answers

### [2024-03-08 15:50] Additional Features Specification

**Prompt:**
```
Looks nice, now i want us to discuss 2 things

- the ability to extract the data from LinkedIn generated CV
For this we need to ask the user if he's updloading he's linkedin generated CV, we also need to ask for the linkedin profile in the data we ask, take this into consideration in every layer of the app
( 2 new fields, the linkedin_profile field and is_linkedin_cv field)

- I18n feature
For this i like to have a folder inside the frontend folder called lang, in which we will have folders using the i18n convention for languages (en_US, es_ES, etc..), they will include files for the topics, they will be JSON files, so in our frontend the text wont be explicit but they will be the i18n key, feel free to use any npm package and a standard way to implement the feature
```

**Purpose:**
Add detailed specifications for LinkedIn CV data extraction and internationalization implementation.

**Outcome:**
Updated the task breakdown to include:
1. LinkedIn CV extraction - Added fields and functionality in frontend and backend
2. Detailed i18n implementation - Created specific folder structure and implementation approach for both frontend and backend

**Files:**
- `docs/tasks.md` - Updated with LinkedIn CV extraction and i18n implementation details

### [2024-03-09 18:30] Integration Testing Framework Setup

**Prompt:**
```
I want to update the backend to improve our integration testing capabilities. Let's modify the candidate.integration.test.ts file to make it work with our current API structure.
```

**Purpose:**
Set up and fix the integration testing framework for the backend application

**Outcome:**
Updated the candidate integration test file to work with our current API structure. Modified the API URL to point to the correct endpoint and added handling for the SKIP_INTEGRATION_TESTS environment variable.

**Files:**
- `backend/src/tests/integration/candidate.integration.test.ts` - Updated API URL and enabled conditional test skipping
- `backend/jest.config.js` - Updated to conditionally skip integration tests

### [2024-03-09 19:15] Docker Testing Environment Setup

**Prompt:**
```
The integration tests still aren't working properly. Let's fix the Docker environment for testing.
```

**Purpose:**
Configure a proper Docker environment for running integration tests

**Outcome:**
Fixed issues with the Docker Compose test configuration. Corrected the script path for integration tests and addressed environment configuration problems.

**Files:**
- `docker-compose.test.yml` - Fixed script path for integration tests

### [2024-03-09 20:00] Database Connectivity for Tests

**Prompt:**
```
The integration tests are still failing because they can't connect to the database. Let's fix the database connection configuration.
```

**Purpose:**
Fix database connectivity issues in the testing environment

**Outcome:**
Updated the database connection URL in the environment file to match the Docker configuration. Fixed authentication issues between the API and the database.

**Files:**
- `backend/.env` - Updated database connection URL

### [2024-03-09 21:00] Admin User Creation and API Verification

**Prompt:**
```
Now let's create a script to seed an admin user for testing authentication and verify that our API is working correctly.
```

**Purpose:**
Create a database seeding script and verify API functionality

**Outcome:**
Created a script to seed an admin user in the database. Successfully tested key API endpoints including health check, authentication, and candidate operations.

**Files:**
- `backend/seed-admin.js` - Created admin user seeding script

### [2024-03-09 21:30] Testing Documentation Update

**Prompt:**
```
Let's update the documentation for our testing framework.
```

**Purpose:**
Document the testing framework improvements and usage instructions

**Outcome:**
Updated the testing documentation with comprehensive information on running tests, environment setup, database seeding, and API testing.

**Files:**
- `backend/TESTING.md` - Updated testing documentation
- `docs/testing-framework.md` - Updated testing framework overview

### [2024-03-09 22:45] Simplified Integration Test Execution

**Prompt:**
```
backend-1  | Setting execute permissions for script...
backend-1  | Running integration tests script...
backend-1  | sh: /app/src/tests/scripts/run-integration-tests.sh: not found
backend-1 exited with code 127
```

**Purpose:**
Replace the problematic script execution with direct test commands in Docker Compose

**Outcome:**
Simplified the test execution by embedding the necessary commands directly in the Docker Compose file instead of relying on an external script. Included commands to start the server in the background, run the integration tests, and then stop the server.

**Files:**
- `docker-compose.test.yml` - Replaced script execution with direct commands

### [2024-03-09 23:00] Server Binding and API URL Fix

**Prompt:**
```
backend-1  | Running integration tests...
backend-1  | console.error
backend-1  |     Network error connecting to http://localhost:3011: Error: connect ECONNREFUSED 127.0.0.1:3011
```

**Purpose:**
Fix server binding and API URL access within Docker containers

**Outcome:**
Updated the Docker configuration to explicitly bind the server to all interfaces (0.0.0.0) and updated the API_URL to use this hostname when running tests. This resolves connection issues between the test process and the server running in the same container.

**Files:**
- `docker-compose.test.yml` - Updated server binding and API URL

### [2024-03-09 23:15] Process Management and Connection Fix

**Prompt:**
```
backend-1  | Failed to connect to API at http://0.0.0.0:3011: Error: connect ECONNREFUSED 0.0.0.0:3011
backend-1  | Stopping server...
backend-1  | sh: you need to specify whom to kill
```

**Purpose:**
Fix connection issues and process management in the Docker Compose file

**Outcome:**
Updated the Docker configuration to use 127.0.0.1 instead of 0.0.0.0 for API connections, and fixed the SERVER_PID variable to properly store and use the process ID. Added proper conditional logic to handle the server process termination.

**Files:**
- `docker-compose.test.yml` - Updated API URL and process management
