# ATS Frontend - Sistema de Seguimiento de Candidatos

Este es el frontend para un Sistema de Seguimiento de Candidatos (ATS - Applicant Tracking System) que permite gestionar candidatos para procesos de selección.

## Características

- Interfaz de usuario moderna e intuitiva con Tailwind CSS
- Formulario de añadir candidatos con validaciones en tiempo real
- Carga de archivos CV en formato PDF o DOCX
- Diseño responsivo para dispositivos móviles y de escritorio
- Integración con API REST del backend

## Requisitos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno en un archivo `.env`:

```
REACT_APP_API_URL=http://localhost:3010
```

## Ejecución

Para desarrollo:

```bash
npm start
```

Para producción:

```bash
npm run build
```

La aplicación se ejecutará en `http://localhost:3000` por defecto.

## Estructura del Proyecto

```
frontend/
├── public/                # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   └── candidates/    # Componentes relacionados con candidatos
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios para API
│   ├── types/             # Definiciones de tipos TypeScript
│   ├── utils/             # Utilidades
│   ├── App.tsx            # Componente principal
│   └── index.tsx          # Punto de entrada
└── tailwind.config.js     # Configuración de Tailwind CSS
```

## Componentes Principales

### CandidateForm

Formulario para añadir un nuevo candidato con las siguientes características:

- Validación en tiempo real de campos
- Soporte para carga de archivos CV
- Mensajes de error claros
- Campos autocompletados para educación y experiencia
- Diseño responsivo

### CandidateModal

Modal que contiene el formulario de candidatos con las siguientes características:

- Animaciones suaves de entrada/salida
- Cierre con botón o haciendo clic fuera del modal
- Mensaje de éxito al completar el formulario

## Integración con el Backend

El frontend se comunica con el backend a través de una API REST. Las principales funciones son:

- `createCandidate`: Envía los datos del formulario al endpoint `/candidatos`
- `getEducationOptions`: Obtiene opciones de educación (simulado actualmente)
- `getExperienceOptions`: Obtiene opciones de experiencia (simulado actualmente)

## Accesibilidad

La aplicación está diseñada con accesibilidad en mente:

- Etiquetas semánticas HTML5
- Atributos ARIA para mejorar la accesibilidad
- Navegación por teclado
- Mensajes de error claros y descriptivos
- Contraste de colores adecuado

## Seguridad

- Validación de datos en el cliente antes de enviar al servidor
- Autenticación mediante JWT (token almacenado en localStorage)
- Sanitización de datos de entrada

## Pruebas

Para ejecutar las pruebas:

```bash
npm test
```

## Uso del Formulario de Candidatos

1. Navega a la página de Dashboard
2. Haz clic en el botón "Añadir Candidato"
3. Completa el formulario con los datos del candidato
4. Opcionalmente, sube un archivo CV en formato PDF o DOCX
5. Haz clic en "Guardar Candidato"
6. Verás un mensaje de éxito si la operación se completa correctamente

## Personalización

El diseño utiliza Tailwind CSS, lo que facilita la personalización. Puedes modificar los colores, espaciados y otros estilos en el archivo `tailwind.config.js`.
