# ATS Frontend

Frontend para la aplicación de Gestión de Candidatos (ATS).

## Estructura del Proyecto

```
frontend/src/
├── components/         # Componentes reutilizables
│   ├── candidate/      # Componentes específicos para candidatos
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Componentes de estructura
│   ├── shared/         # Componentes compartidos
│   └── ui/             # Componentes de UI genéricos
│
├── contexts/           # Contextos de React (SearchContext)
│
├── hooks/              # Hooks personalizados (useCandidates, useToast, etc.)
│
├── pages/              # Páginas de la aplicación
│   ├── Dashboard/      # Página del dashboard
│   └── CandidateList/  # Página de lista de candidatos
│
├── services/           # Servicios para API y lógica de negocio
│
├── styles/             # Estilos globales
│
├── types/              # Definiciones de TypeScript
│
├── utils/              # Utilidades y funciones helpers
│
├── App.tsx             # Componente principal
└── index.tsx           # Punto de entrada
```

## Tecnologías Principales

- React: Framework de UI
- TypeScript: Tipado estático
- TailwindCSS: Estilos
- React Router: Enrutamiento
- Vite: Bundler y servidor de desarrollo

## Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar la compilación de producción
npm run preview

# Ejecutar linting
npm run lint
```

## Guía de Desarrollo

### Componentes

- Crear componentes en la carpeta correspondiente (ui, candidate, etc.)
- Usar TypeScript para todos los componentes nuevos
- Seguir el patrón de exportación utilizado en los componentes existentes

### Tipos

- Definir interfaces/tipos en `types/index.ts`
- Usar interfaces para props de componentes
- Usar tipos para uniones y enumeraciones

### Servicios

- Mantener la lógica de API en archivos de servicio
- Usar tipos para las respuestas de la API
- Manejar errores de manera consistente

### Estilos

- Usar TailwindCSS para estilos
- Definir clases personalizadas en `styles/`
- Mantener consistencia en el diseño

## Convenciones de Código

- Usar camelCase para nombres de variables y funciones
- Usar PascalCase para nombres de componentes y clases
- Usar UPPER_CASE para constantes
- Usar descriptive naming
- Prefijo "use" para hooks personalizados
- Prefijo "handle" para manejadores de eventos
