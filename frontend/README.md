# Frontend - Sistema de Seguimiento de Talento LTI

Este directorio contiene el código del frontend para el Sistema de Seguimiento de Talento LTI, desarrollado con React y TypeScript.

## Estructura del Proyecto

```
frontend/
├── public/             # Archivos estáticos
├── src/                # Código fuente
│   ├── components/     # Componentes React reutilizables
│   │   ├── candidate/  # Componentes específicos para candidatos
│   │   └── ...         # Otros componentes
│   ├── pages/          # Páginas principales de la aplicación
│   ├── services/       # Servicios para comunicación con el backend
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades y funciones auxiliares
│   ├── App.tsx         # Componente principal de la aplicación
│   └── index.tsx       # Punto de entrada
├── package.json        # Dependencias y scripts
└── tsconfig.json       # Configuración de TypeScript
```

## Características Principales

### Formulario de Candidatos
- Formulario completo para añadir candidatos con validación en tiempo real
- Soporte para múltiples entradas de educación y experiencia laboral
- Fechas opcionales para educación y experiencia en curso
- Carga de CV en formato PDF o DOCX

### Validación de Datos
- Validación en tiempo real de todos los campos
- Validación específica para formatos de correo electrónico y teléfono
- Validación de fechas para asegurar coherencia temporal
- Mensajes de error claros y específicos

### Seguridad
- Protección de datos sensibles mediante enmascaramiento
- Transmisión segura de datos al backend
- Manejo seguro de archivos adjuntos

### Interfaz de Usuario
- Diseño responsivo adaptable a diferentes dispositivos
- Interfaz intuitiva y fácil de usar
- Mensajes de confirmación y error claros
- Navegación sencilla entre secciones

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superset tipado de JavaScript
- **React Hook Form**: Gestión de formularios con validación
- **Zod**: Validación de esquemas
- **Material-UI**: Componentes de interfaz de usuario
- **Axios**: Cliente HTTP para comunicación con el backend

## Últimas Actualizaciones

- **Fechas opcionales**: Implementación de fechas de fin opcionales para educación y experiencia en curso
- **Protección de datos**: Enmascaramiento de datos sensibles como teléfono, dirección y correo electrónico
- **Mejora en validaciones**: Validación en tiempo real más robusta para todos los campos
- **Mejora en UX**: Mensajes más claros y específicos para guiar al usuario
- **Optimización**: Mejoras en el rendimiento y la estructura del código

## Instalación y Ejecución

1. Instala las dependencias:
```sh
npm install
```

2. Inicia el servidor de desarrollo:
```sh
npm start
```

3. Para construir la versión de producción:
```sh
npm run build
```

## Pruebas

Para ejecutar las pruebas:
```sh
npm test
```

## Notas para Desarrolladores

- Asegúrate de que el backend esté en ejecución antes de probar funcionalidades que requieran comunicación con el servidor.
- Para el desarrollo local, el frontend se comunica con el backend en `http://localhost:3010/api`.
- Las validaciones de formularios están definidas en los esquemas Zod correspondientes.
