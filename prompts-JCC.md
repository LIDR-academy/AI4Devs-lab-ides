# Prompts de Desarrollo para la Función "Añadir Candidato"

Este documento contiene prompts de desarrollo para implementar la historia de usuario "Añadir Candidato al Sistema". Estos prompts guían el desarrollo de componentes tanto de backend como de frontend, siguiendo buenas prácticas de código limpio, principios SOLID, medidas de seguridad y diseño responsive.

## 1. Mejora del Esquema de Base de Datos

Diseñar un esquema de base de datos relacional que soporte eficientemente la gestión de candidatos, considerando los siguientes aspectos:

1. Modelo Principal de Candidato:
   - Identificador único
   - Información personal básica (nombre, apellido)
   - Información de contacto (email único, teléfono)
   - Dirección
   - URL del currículum
   - Estado del candidato en el proceso
   - Notas adicionales
   - Marcas de tiempo (creación y actualización)

2. Modelo de Educación:
   - Relación uno a muchos con el candidato
   - Información de la institución educativa
   - Título o grado obtenido
   - Campo de estudio
   - Fechas de inicio y fin
   - Indicador de estudios actuales

3. Modelo de Experiencia Laboral:
   - Relación uno a muchos con el candidato
   - Información de la empresa
   - Cargo desempeñado
   - Descripción de responsabilidades
   - Fechas de inicio y fin
   - Indicador de trabajo actual

4. Consideraciones de Diseño:
   - Implementar normalización adecuada
   - Establecer relaciones apropiadas entre entidades
   - Definir tipos de datos optimizados
   - Configurar restricciones de integridad
   - Implementar índices para campos de búsqueda frecuente

5. Aspectos de Seguridad:
   - Protección de datos sensibles
   - Gestión de permisos
   - Registro de auditoría cuando sea necesario

Utilizar las mejores prácticas de diseño de bases de datos relacionales mientras se mantiene un equilibrio entre normalización y rendimiento.

## 2. Desarrollo de API Backend

Implementar endpoints de API RESTful para la gestión de candidatos:

1. Crear una estructura de carpetas modular:
   - routes/
   - controllers/
   - services/
   - middlewares/
   - utils/

2. Implementar los siguientes endpoints:
   - POST /api/candidates - Crear un nuevo candidato
   - GET /api/candidates - Listar todos los candidatos
   - GET /api/candidates/:id - Obtener un candidato específico
   - PUT /api/candidates/:id - Actualizar un candidato
   - DELETE /api/candidates/:id - Eliminar un candidato

3. Para cargas de archivos:
   - Implementar servicio para la carga de documentos de currículum con librería multer
   - Validar tipos de archivo (solo PDF, DOCX)
   - Implementar límites de tamaño de archivo (máximo 2 MB)
   - Almacenar archivos de forma segura con nombres únicos

4. Implementar validación adecuada:
   - Validar todos los datos de entrada
   - Desinfectar entradas para prevenir ataques de inyección
   - Devolver mensajes de error apropiados

5. Implementar manejo de errores:
   - Crear middleware para respuestas de error consistentes
   - Registrar errores apropiadamente
   - Manejar casos extremos

Seguir principios SOLID, especialmente:
- Responsabilidad Única: Cada módulo debe tener una sola razón para cambiar
- Inversión de Dependencia: Los módulos de alto nivel no deben depender de módulos de bajo nivel
- incluir en el package.json las dependencias necesarias

## 3. Estructura de Componentes Frontend con Enfoque Responsive

Implementar una estructura frontend organizada y responsive para la gestión de candidatos:

1. Estructura de Carpetas Base:
   - Componentes React
   - Componentes reutilizables
   - Componentes de estructura
   - Componentes específicos
   - Custom hooks
   - Servicios API
   - Tipos TypeScript
   - Utilidades
   - Estilos globales
   - Páginas de la aplicación

2. Componentes Principales:
   - Formulario de ingreso de candidatos
   - Lista de candidatos
   - Detalles de candidato
   - Componentes de navegación

3. Características Clave:
   - Diseño responsive (mobile-first)
   - Validación de formularios
   - Integración con API backend
   - Manejo de estado
   - Gestión de archivos (CV)

4. Consideraciones Técnicas:
   - TypeScript para tipo seguro
   - Componentes modulares y reutilizables
   - Manejo de errores y loading states
   - Accesibilidad básica

Esta estructura proporciona una base sólida para desarrollar la interfaz de usuario manteniendo un código organizado y escalable.

## 4. Implementación del Formulario Responsive

Crear un formulario robusto y responsive para candidatos con las siguientes características:

1. Estructura del formulario responsive:
   - Diseño de una columna para dispositivos móviles
   - Diseño multicolumna para tablets y escritorio
   - Sección de información personal (nombre, email, teléfono, dirección)
   - Sección de educación (con capacidad para añadir múltiples entradas)
   - Sección de experiencia laboral (con capacidad para añadir múltiples entradas)
   - Sección de carga de currículum adaptada a diferentes dispositivos
   - Botones de envío y cancelación de tamaño apropiado para interacción táctil

2. Validación de formulario:
   - Validación del lado del cliente para todos los campos
   - Validación del formato de email
   - Validación de campos obligatorios
   - Mensajes de validación personalizados adaptados al tamaño de pantalla

3. Experiencia de usuario responsive:
   - Tipos de campo apropiados (texto, email, tel) con tamaño adaptable
   - Autoformateo para números de teléfono
   - Indicadores claros de error visibles en todos los dispositivos
   - Estados de carga durante el envío
   - Formulario paso a paso con validación

4. Accesibilidad:
   - Etiquetas adecuadas y atributos ARIA
   - Soporte para navegación con teclado
   - Gestión del foco
   - Cumplimiento de contraste de color
   - Texto legible en todos los tamaños de pantalla (mínimo 16px en móvil)

Utilizar CSS Grid y Flexbox para layouts responsive, con media queries para ajustes específicos por dispositivo.

## 5. Integración de API

Implementar servicios frontend para comunicarse con la API backend:

1. Crear módulos de servicio API:
   - Funciones para operaciones CRUD en candidatos
   - Funciones para cargas de archivos
   - pantalla de resumen al crear un candidato
   - listar candidatos en pantalla dashboard

2. Implementar manejo adecuado de errores:
   - Capturar y procesar errores de API
   - Mostrar mensajes de usuario apropiados
   - Implementar lógica de reintento donde sea apropiado

3. Gestión de estado:
   - Implementar estados de carga durante llamadas a API
   - Almacenar datos de candidatos apropiadamente
   - Implementar actualizaciones optimistas para mejor UX

4. Consideraciones de seguridad:
   - Manejar autenticación/autorización
   - Asegurar datos sensibles
   - Implementar protección CSRF

Utilizar Axios o Fetch API con interceptores adecuados para manejar el procesamiento común de respuestas y configuración de url de servido en archivo .env

## 6. Implementación de Carga de Archivos

Implementar funcionalidad segura de carga de archivos:

1. Frontend:
   - Crear un componente de carga de archivos con soporte de arrastrar y soltar
   - Implementar validación de tipo de archivo (solo PDF, DOCX)
   - Implementar validación de tamaño de archivo (máximo 2 MB)
   - Mostrar indicador de progreso de carga
   - Manejar errores de carga con elegancia
   - Vista previa de archivos cargados cuando sea posible
   - Adaptar interfaz para ser usable en dispositivos móviles y táctiles

2. Backend:
   - Implementar análisis de formularios multipart
   - Validar tipos y tamaños de archivo del lado del servidor (rechazar archivos >2 MB)
   - Escanear archivos en busca de malware (opcional)
   - Almacenar archivos en almacenamiento local como etapa inicial (desarrollo)
   con el patrón: {prefijo}_{id-candidato}_{hash}.{extension}, Ejemplo: cv_12345_a7f3d9.pdf
   - Evita colisiones de nombres en el guardado de archivos.
   - Diseño con patrón Adapter para facilitar la migración futura a otros proveedores como minio, s3, etc.
   - Almacenar metadatos de archivo en la base de datos

3. Seguridad:
   - Implementar límites de tamaño de archivo estrictos de 2 MB
   - Generar nombres de archivo únicos para prevenir sobrescrituras
   - Establecer permisos de archivo apropiados
   - Validar contenido de archivos

Considerar implementar una solución de almacenamiento en la nube para producción.

## 7. Implementación de Seguridad

Mejorar la seguridad a lo largo de la aplicación:

1. Protección de datos:
   - Implementar validación y desinfección de entradas
   - Proteger contra ataques XSS
   - Implementar protección CSRF
   - Asegurar endpoints de API con autenticación apropiada

2. Seguridad de archivos:
   - Validar cargas de archivos minuciosamente
   - Implementar límite estricto de 2 MB para tamaño de archivos
   - Almacenar archivos de forma segura
   - Generar enlaces de descarga seguros

3. Seguridad de base de datos:
   - Usar consultas parametrizadas
   - Implementar indexación adecuada
   - Cifrar datos sensibles

4. Autenticación:
   - Implementar autenticación adecuada para reclutadores
   - Usar almacenamiento seguro de contraseñas
   - Implementar limitación de tasa para intentos de inicio de sesión

Seguir las directrices de OWASP para seguridad de aplicaciones web.

## 8. Consideraciones de UI/UX Responsive

Implementar una interfaz de usuario limpia, intuitiva y completamente responsive:

1. Integración del dashboard responsive:
   - Añadir un botón prominente "Añadir Candidato" visible en todos los dispositivos
   - Diseño de tarjetas para móvil y tabla para escritorio en la lista de candidatos
   - Mostrar información clave de candidatos ajustada según el tamaño de pantalla
   - Menú de navegación colapsable en dispositivos pequeños

2. Diseño de formulario responsive:
   - Crear un formulario de múltiples pasos adaptable a todos los dispositivos
   - Usar encabezados de sección claros y visibles
   - Proporcionar texto de ayuda para campos complejos
   - Implementar retroalimentación de validación en línea
   - Adaptar formularios a pantallas pequeñas (campos apilados) y grandes (campos en múltiples columnas)

3. Estrategia responsive completa:
   - Implementar el enfoque mobile-first en todos los estilos CSS
   - Utilizar unidades relativas (rem, em, vh, vw) en lugar de píxeles fijos
   - Definir breakpoints estándar para móvil, tablet y escritorio
   - Usar imágenes responsive con srcset y tamaños adaptables
   - Implementar componentes que se adapten automáticamente a su contenedor
   - Testear en múltiples dispositivos reales y emuladores

4. Accesibilidad para todos los dispositivos:
   - Seguir directrices WCAG en todas las resoluciones
   - Implementar navegación con teclado funcional en todos los dispositivos
   - Asegurar compatibilidad con lectores de pantalla
   - Usar elementos HTML semánticos
   - Mantener ratios de contraste adecuados en todos los tamaños de pantalla

Utilizar herramientas como Storybook para desarrollar y probar componentes en múltiples tamaños de pantalla antes de la integración.


## 9. verificar el proyecto en busca de errores

verifica el proyecto en busca de importaciones y librerías faltantes

## 10. verificación de rendimiento

verificar el rendimiento de la app:

1. Optimización:
   - Implementar división de código para rendimiento
   - Optimizar llamadas a API y consultas de base de datos
   - Implementar almacenamiento en caché donde sea apropiado
   - Comprimir imágenes y activos
   - Optimizar rendimiento en dispositivos móviles con conexiones lentas

2. Manejo de errores:
   - Implementar límites de error globales
   - Configurar registro y monitoreo de errores
   - Crear páginas de error amigables para el usuario

## 11. Ajuste endpoints

El endpoint de listar debe contemplar toda la información ingresada en el formulario para que al momento de ver detalle en la lista se muestre un resumen completo.

## 12: Ajuste vista de listar

En la tabla de listar incluir botón de refrescar para cargar de nuevo la lista de candidatos.

Para la confirmación de eliminar candidato crear modal con estilos acordes al diseño de la app