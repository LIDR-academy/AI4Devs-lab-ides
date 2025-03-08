# LTI Talent Tracking System

## Descripción del Proyecto
El LTI Talent Tracking System es una aplicación web diseñada para ayudar a los reclutadores a gestionar candidatos y procesos de selección de manera eficiente. La aplicación está construida con tecnologías modernas y sigue las mejores prácticas de desarrollo y accesibilidad.

### Credenciales de Acceso
Para acceder al sistema, puedes utilizar las siguientes credenciales según el rol:

#### Administrador
```
Email: admin@lti-talent.com
Password: 12345aA!
```

#### Reclutador
```
Email: recruiter@lti-talent.com
Password: 12345aA!
```

> **Nota**: Estas son credenciales de prueba. En un entorno de producción, asegúrate de cambiar estas contraseñas por unas más seguras y únicas para cada usuario.

### Características Principales
- **Gestión de Candidatos**
  - Crear, editar y eliminar perfiles de candidatos
  - Gestionar CV en formatos PDF y DOCX
  - Seguimiento de información profesional y académica
  - Sistema de notificaciones para acciones importantes

- **Gestión de Procesos de Selección**
  - Crear y gestionar procesos de selección
  - Seguimiento de etapas del proceso
  - Asignación de candidatos a procesos
  - Actualización de estados y seguimiento

- **Sistema de Usuarios**
  - Roles diferenciados (Admin, Recruiter)
  - Gestión de permisos basada en roles
  - Interfaz personalizada según el rol

### Tecnologías Utilizadas
- Frontend:
  - React con TypeScript
  - TailwindCSS para estilos
  - React Router para navegación
  - Contextos para gestión de estado

- Testing:
  - Playwright para pruebas E2E
  - Pruebas de componentes
  - Pruebas de integración

## Instalación y Configuración

### Requisitos Previos
- Node.js 18 o superior
- npm o yarn
- Git

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd AI4Devs-lab-ides
```

2. Instalar dependencias:
```bash
# Instalar dependencias del proyecto
npm install

# Instalar Playwright y sus dependencias
npm install --save-dev @playwright/test @types/node
npx playwright install --with-deps
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Iniciar la aplicación en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Ejecución de Pruebas

### Preparación del Entorno de Pruebas

1. Asegúrate de que la aplicación está en ejecución:
```bash
# Terminal 1: Iniciar la aplicación
npm run dev

# Esperar a que la aplicación esté disponible en http://localhost:3000
```

2. Crear estructura de carpetas para pruebas (en una nueva terminal):
```bash
# Terminal 2: Preparar entorno de pruebas
mkdir -p tests/test-files tests/downloads
```

3. Crear archivos de prueba:
```bash
cd tests/test-files

# Crear PDF de prueba
echo "Test CV" > test-cv.pdf

# Crear DOCX de prueba
echo "Test CV" > test-cv.docx

# Crear archivo de texto para pruebas de validación
echo "Invalid file" > invalid.txt

# Crear archivo grande para pruebas (6MB)
fsutil file createnew large-file.pdf 6291456
```

### Ejecutar Pruebas

1. **IMPORTANTE**: Asegúrate de que la aplicación está en ejecución en http://localhost:3000 antes de ejecutar las pruebas.

2. En una terminal separada, ejecuta las pruebas:

```bash
# Ejecutar todas las pruebas
npx playwright test

# O ejecutar pruebas específicas
npx playwright test tests/candidates.spec.ts
npx playwright test tests/processes.spec.ts
npx playwright test tests/documents.spec.ts
```

3. Para ejecutar pruebas con interfaz visual:
```bash
npx playwright test --ui
```

### Solución de Problemas Comunes

#### Error de Timeout en Login
Si encuentras errores de timeout durante el login:
1. Verifica que la aplicación está ejecutándose en http://localhost:3000
2. Asegúrate de que las credenciales son correctas:
   ```
   Email: recruiter@lti-talent.com
   Password: 12345aA!
   ```
3. Aumenta el timeout en la configuración de las pruebas:
   ```bash
   # Ejecutar con timeout aumentado
   npx playwright test --timeout=60000
   ```

### Visualización de Resultados

1. Reporte HTML:
- Después de ejecutar las pruebas, se genera automáticamente un reporte HTML
- Abrir `playwright-report/index.html` en el navegador
- El reporte incluye:
  - Resumen de pruebas ejecutadas
  - Detalles de pruebas fallidas
  - Capturas de pantalla y trazas
  - Tiempos de ejecución

2. Resultados en consola:
- Muestra resumen en tiempo real
- Indica pruebas pasadas/fallidas
- Muestra errores y stacktraces

3. Modo UI:
- Interfaz visual para depuración
- Reproducción paso a paso
- Inspección de elementos
- Edición y re-ejecución de pruebas

## Casos de Prueba Implementados

### Gestión de Candidatos
- Creación de nuevo candidato
- Edición de candidato existente
- Eliminación de candidato
- Validación de campos obligatorios
- Manejo de errores de validación

### Gestión de Procesos
- Creación de proceso de selección
- Edición de proceso existente
- Eliminación de proceso
- Actualización de estado del proceso
- Gestión de etapas del proceso
- Validaciones de formulario

### Gestión de Documentos
- Carga de CV en PDF
- Carga de CV en DOCX
- Validación de tipos de archivo
- Validación de tamaño máximo
- Descarga de CV
- Reemplazo de CV existente

## Mejores Prácticas Implementadas

### Accesibilidad
- Atributos ARIA
- Navegación por teclado
- Mensajes descriptivos
- Contraste de colores
- Textos alternativos

### Responsive Design
- Diseño adaptativo
- Breakpoints para diferentes dispositivos
- Optimización móvil
- Pruebas en múltiples resoluciones

### Seguridad
- Validación de entrada
- Manejo seguro de archivos
- Protección de rutas
- Gestión de sesiones

## Soporte y Contribución

### Reportar Problemas
- Usar el sistema de issues
- Incluir pasos para reproducir
- Adjuntar capturas de pantalla
- Especificar entorno

### Contribuir
- Fork del repositorio
- Crear branch descriptiva
- Seguir guía de estilo
- Crear Pull Request

## Licencia
[Especificar licencia] 