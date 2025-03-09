# Tasks Breakdown

This document breaks down the technical tasks required to implement each user story into specific, actionable subtasks.

## US-001: Añadir Candidato al Sistema

### Technical Task 1: Implementar la interfaz de usuario para el formulario de añadir candidato

#### Subtasks:

1. **Configuración inicial del UI**
   - Instalar y configurar Tailwind CSS
   - Configurar shadcn/ui componentes
   - Crear estructura base para el formulario multi-paso

2. **Diseño del flujo de pasos del wizard**
   - Crear componente de navegación entre pasos
   - Implementar indicador de progreso
   - Configurar la validación antes de pasar a siguientes pasos

3. **Implementación de formulario - Información personal**
   - Crear campos para datos básicos (nombre, apellido, email, teléfono, dirección)
   - **Implementar campo para perfil de LinkedIn**
   - Implementar validaciones para cada campo
   - Crear componente de alerta para errores de validación

4. **Implementación de formulario - Educación**
   - Crear componente para manejar múltiples entradas de educación
   - Implementar campos para cada entrada: institución, grado, fechas, resumen
   - Crear botones para añadir/eliminar entradas de educación

5. **Implementación de formulario - Experiencia laboral**
   - Crear componente para manejar múltiples entradas de experiencia
   - Implementar campos para cada entrada: empresa, posición, fechas, resumen
   - Crear botones para añadir/eliminar entradas de experiencia

6. **Implementación de formulario - Habilidades y preferencias**
   - Crear campos para habilidades, idiomas y salario deseado
   - Implementar componente para añadir/eliminar múltiples habilidades e idiomas
   - Implementar validaciones para cada campo

7. **Implementación de carga de CV**
   - Crear componente de carga de archivo
   - **Añadir opción para indicar si el CV es generado por LinkedIn**
   - Implementar validación de formato (solo PDF)
   - Implementar límite de tamaño de archivo
   - Crear visualizador de archivo PDF cargado

8. **Implementación de componentes de notificación**
   - Crear componentes para mensajes de éxito
   - Crear componentes para mensajes de error
   - Implementar notificaciones temporales

9. **Optimización para dispositivos móviles y accesibilidad**
   - Asegurar diseño responsivo para todos los componentes
   - Implementar navegación adaptativa para dispositivos móviles
   - Verificar accesibilidad (etiquetas ARIA, contraste, navegación por teclado)

10. **Implementación de i18n en Frontend**
    - Crear estructura de carpetas en `frontend/lang/` con subcarpetas por idioma (ej: `en_US`, `es_ES`)
    - Crear archivos JSON por temas para cada idioma
    - Instalar y configurar biblioteca i18next con react-i18next
    - Implementar sistema de cambio de idioma
    - Reemplazar todo texto estático con claves i18n

11. **Integración con API**
    - Implementar llamadas a la API para enviar datos
    - Manejar respuestas y errores de la API
    - Mostrar mensajes de éxito/error según respuesta

### Technical Task 2: Desarrollar el backend necesario para procesar la información ingresada en el formulario

#### Subtasks:

1. **Definición de modelos de datos**
   - Crear modelo Candidato con todos los campos requeridos
   - **Añadir campos linkedin_profile y is_linkedin_cv al modelo Candidato**
   - Crear modelo para Educación
   - Crear modelo para Experiencia Laboral
   - Crear modelo para Habilidades
   - Crear modelo para documentos CV
   - Configurar relaciones entre modelos
   - Implementar soft delete para todos los modelos

2. **Implementación de endpoints REST**
   - Crear endpoint POST para añadir candidato
   - Crear endpoint GET para obtener datos de un candidato
   - Crear endpoint PUT para actualizar datos de candidato
   - Crear endpoint DELETE para eliminación lógica de candidato
   - Crear endpoint para manejo de subida de CV

3. **Validación de datos**
   - Implementar middleware de validación para todos los campos
   - **Implementar validación para campos de LinkedIn**
   - Crear validadores personalizados para formatos específicos (email, teléfono)
   - Implementar validación de tipo y tamaño de archivo

4. **Manejo de archivos CV**
   - Implementar lógica para almacenamiento de archivos en base de datos
   - Crear función para generación de nombres de archivo según convención (CV_{email}_{timestamp}.pdf)
   - Implementar lógica para actualizar archivo si ya existe uno previo

5. **Implementación del extractor de datos de CV de LinkedIn**
   - Investigar y seleccionar biblioteca para extracción de texto de PDF
   - Implementar lógica para identificar y extraer información estructurada de CVs de LinkedIn
   - Crear mapeo entre datos extraídos y modelos de la aplicación
   - Implementar manejo de errores para casos donde la extracción falle
   - Desarrollar API endpoint específico para procesar CVs de LinkedIn

6. **Integración de i18n en Backend**
   - Configurar sistema de mensajes internacionalizados
   - Crear estructura para almacenar diccionarios de mensajes
   - Implementar middleware para detección de idioma preferido
   - Asegurar que todas las respuestas de API usen el formato i18n
   - Crear mecanismo para añadir/actualizar traducciones

7. **Implementación de manejo de errores**
   - Crear middleware de manejo centralizado de errores
   - Implementar respuestas estandarizadas para diferentes tipos de errores
   - Asegurar que todos los errores sean capturados y devueltos apropiadamente
   - **Asegurar que los errores respeten el formato i18n**

8. **Implementación de autenticación y autorización**
   - Configurar middleware JWT para autenticación
   - Implementar RBAC (Control de Acceso Basado en Roles)
   - Crear middleware para validar permisos de usuario (Admin vs Candidato)

9. **Configuración de CORS**
   - Implementar política CORS para permitir acceso desde frontend y futuro sistema móvil
   - Configurar cabeceras adecuadas para seguridad

10. **Implementación de sistema de logging**
    - Configurar sistema de logging a archivos
    - Implementar diferentes niveles de log (info, warning, error)
    - Asegurar registro de todas las operaciones para auditoría

### Technical Task 3: Asegurar la seguridad y privacidad de los datos del candidato

#### Subtasks:

1. **Implementación de autenticación segura**
   - Configurar generación y validación de tokens JWT
   - Implementar expiración y renovación de tokens
   - Asegurar almacenamiento seguro de claves secretas JWT

2. **Protección contra vulnerabilidades comunes**
   - Implementar protección contra inyección SQL
   - Implementar protección contra XSS
   - Implementar protección contra CSRF
   - Implementar límites de tasa para prevenir ataques de fuerza bruta

3. **Validación y sanitización de entrada**
   - Implementar sanitización de todos los datos de entrada
   - Validar tipos y formatos de datos
   - Restringir tamaños máximos para todos los campos de texto
   - **Implementar validación específica para URLs de perfiles de LinkedIn**

4. **Seguridad en carga de archivos**
   - Implementar validación del tipo MIME real de archivos
   - Limitar tamaño máximo de archivos
   - Escanear archivos para prevenir malware (si es posible)
   - Almacenar archivos de forma segura

5. **Cumplimiento de GDPR**
   - Implementar consentimiento para procesamiento de datos
   - Asegurar que todos los datos personales se manejen según GDPR
   - Implementar mecanismo para exportar datos de un usuario
   - Implementar mecanismo para eliminar datos de un usuario

6. **Hashing seguro de contraseñas**
   - Implementar algoritmo de hashing seguro (bcrypt/argon2)
   - Configurar factores de trabajo apropiados
   - No almacenar contraseñas en texto plano en ningún momento

7. **Implementación de sistema de auditoría**
   - Registrar todos los accesos a datos de candidatos
   - Registrar todas las modificaciones a datos sensibles
   - Implementar retención de logs por tiempo adecuado
   - Asegurar que los logs no contengan datos sensibles

8. **Configuración de cabeceras HTTP de seguridad**
   - Implementar Content-Security-Policy
   - Configurar X-Content-Type-Options
   - Configurar X-Frame-Options
   - Configurar otras cabeceras de seguridad relevantes

9. **Revisión de seguridad**
   - Realizar análisis de seguridad del código
   - Verificar que no haya credenciales en el código
   - Verificar manejo adecuado de errores que no exponga información sensible