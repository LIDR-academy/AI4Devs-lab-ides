# Plan de Pruebas - Gestión de Candidatos

## Introducción

Este documento describe el plan de pruebas para la funcionalidad de añadir candidatos al Sistema de Seguimiento de Talento (LTI). El objetivo es garantizar que la funcionalidad cumpla con los requisitos especificados en la historia de usuario USR01 y que funcione correctamente en todos los escenarios posibles.

## Alcance

El plan de pruebas cubre:

- Validación de la interfaz de usuario del formulario de candidatos
- Validación de la funcionalidad de carga de documentos
- Validación de la API de gestión de candidatos
- Pruebas de integración entre frontend y backend
- Pruebas de accesibilidad y compatibilidad

## Entorno de Pruebas

### Configuración del Entorno

- **Backend**: Servidor Express ejecutándose en `http://localhost:3010`
- **Frontend**: Aplicación React ejecutándose en `http://localhost:3000`
- **Base de Datos**: PostgreSQL ejecutándose en Docker
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Dispositivos**: Desktop, Tablet, Mobile

### Herramientas de Prueba

- **Pruebas Unitarias Backend**: Jest
- **Pruebas Unitarias Frontend**: Jest + React Testing Library
- **Pruebas de Integración**: Cypress
- **Pruebas de Accesibilidad**: Axe, Lighthouse
- **Pruebas de Compatibilidad**: BrowserStack

## Casos de Prueba

### 1. Pruebas de Interfaz de Usuario

#### 1.1 Validación de Campos del Formulario

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| UI-01 | Validación de campos obligatorios | 1. Acceder al formulario<br>2. Dejar campos obligatorios en blanco<br>3. Intentar enviar el formulario | Se muestran mensajes de error para los campos obligatorios (nombre, apellido, email) | Alta |
| UI-02 | Validación de formato de email | 1. Acceder al formulario<br>2. Ingresar un email con formato inválido<br>3. Intentar enviar el formulario | Se muestra un mensaje de error indicando que el formato del email es inválido | Alta |
| UI-03 | Validación en tiempo real | 1. Acceder al formulario<br>2. Comenzar a escribir en los campos<br>3. Observar la validación mientras se escribe | Los errores de validación se muestran/ocultan en tiempo real mientras el usuario escribe | Media |
| UI-04 | Mensajes de error claros | 1. Provocar diferentes errores de validación<br>2. Verificar los mensajes de error | Los mensajes de error son claros, específicos y ayudan al usuario a corregir el problema | Media |

#### 1.2 Carga de Documentos

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| UI-05 | Carga de archivo PDF | 1. Acceder al formulario<br>2. Seleccionar un archivo PDF<br>3. Verificar la previsualización | El archivo se carga correctamente y se muestra el nombre del archivo | Alta |
| UI-06 | Carga de archivo DOCX | 1. Acceder al formulario<br>2. Seleccionar un archivo DOCX<br>3. Verificar la previsualización | El archivo se carga correctamente y se muestra el nombre del archivo | Alta |
| UI-07 | Validación de tipo de archivo | 1. Acceder al formulario<br>2. Intentar cargar un archivo con formato no permitido (ej. JPG) | Se muestra un mensaje de error indicando que el tipo de archivo no está permitido | Alta |
| UI-08 | Validación de tamaño de archivo | 1. Acceder al formulario<br>2. Intentar cargar un archivo mayor a 5MB | Se muestra un mensaje de error indicando que el archivo excede el tamaño máximo permitido | Alta |
| UI-09 | Funcionalidad Drag & Drop | 1. Acceder al formulario<br>2. Arrastrar un archivo al área de carga<br>3. Soltar el archivo | El archivo se carga correctamente mediante drag & drop | Media |
| UI-10 | Eliminar archivo cargado | 1. Cargar un archivo<br>2. Hacer clic en "Eliminar archivo" | El archivo se elimina y se muestra nuevamente la opción para cargar | Media |

#### 1.3 Feedback al Usuario

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| UI-11 | Mensaje de éxito | 1. Completar el formulario correctamente<br>2. Enviar el formulario | Se muestra un mensaje de éxito indicando que el candidato ha sido añadido | Alta |
| UI-12 | Mensaje de error | 1. Provocar un error en el servidor (ej. email duplicado)<br>2. Enviar el formulario | Se muestra un mensaje de error claro indicando el problema | Alta |
| UI-13 | Indicador de carga | 1. Completar el formulario correctamente<br>2. Enviar el formulario<br>3. Observar durante el proceso de envío | Se muestra un indicador de carga mientras se procesa la solicitud | Media |

### 2. Pruebas de API

#### 2.1 Endpoint POST /api/candidates

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| API-01 | Crear candidato con datos válidos | 1. Enviar una petición POST con datos válidos | Respuesta 201 Created con los datos del candidato creado | Alta |
| API-02 | Validación de campos obligatorios | 1. Enviar una petición POST sin campos obligatorios | Respuesta 400 Bad Request con mensaje de error específico | Alta |
| API-03 | Validación de email único | 1. Crear un candidato<br>2. Intentar crear otro candidato con el mismo email | Respuesta 400 Bad Request con mensaje indicando que el email ya existe | Alta |
| API-04 | Validación de formato de email | 1. Enviar una petición POST con un email de formato inválido | Respuesta 400 Bad Request con mensaje indicando que el formato del email es inválido | Alta |
| API-05 | Carga de archivo PDF | 1. Enviar una petición POST con un archivo PDF | Respuesta 201 Created con URL del archivo almacenado | Alta |
| API-06 | Carga de archivo DOCX | 1. Enviar una petición POST con un archivo DOCX | Respuesta 201 Created con URL del archivo almacenado | Alta |
| API-07 | Validación de tipo de archivo | 1. Enviar una petición POST con un archivo de tipo no permitido | Respuesta 400 Bad Request con mensaje indicando que el tipo de archivo no está permitido | Alta |
| API-08 | Validación de tamaño de archivo | 1. Enviar una petición POST con un archivo mayor a 5MB | Respuesta 400 Bad Request con mensaje indicando que el archivo excede el tamaño máximo | Alta |

#### 2.2 Endpoint GET /api/candidates

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| API-09 | Obtener todos los candidatos | 1. Enviar una petición GET | Respuesta 200 OK con lista de candidatos | Media |
| API-10 | Obtener candidatos cuando no hay ninguno | 1. Asegurar que no hay candidatos en la BD<br>2. Enviar una petición GET | Respuesta 200 OK con array vacío | Baja |

#### 2.3 Endpoint GET /api/candidates/:id

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| API-11 | Obtener candidato por ID válido | 1. Crear un candidato<br>2. Enviar una petición GET con el ID del candidato | Respuesta 200 OK con datos del candidato | Media |
| API-12 | Obtener candidato con ID inexistente | 1. Enviar una petición GET con un ID que no existe | Respuesta 404 Not Found con mensaje indicando que el candidato no existe | Media |
| API-13 | Obtener candidato con ID inválido | 1. Enviar una petición GET con un ID de formato inválido | Respuesta 400 Bad Request con mensaje indicando que el ID es inválido | Baja |

#### 2.4 Endpoint PUT /api/candidates/:id

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| API-14 | Actualizar candidato con datos válidos | 1. Crear un candidato<br>2. Enviar una petición PUT con datos válidos | Respuesta 200 OK con datos actualizados | Media |
| API-15 | Actualizar candidato con ID inexistente | 1. Enviar una petición PUT con un ID que no existe | Respuesta 404 Not Found con mensaje indicando que el candidato no existe | Media |
| API-16 | Actualizar email a uno ya existente | 1. Crear dos candidatos<br>2. Intentar actualizar el email de uno al del otro | Respuesta 400 Bad Request con mensaje indicando que el email ya existe | Media |
| API-17 | Actualizar archivo CV | 1. Crear un candidato con CV<br>2. Enviar una petición PUT con un nuevo archivo CV | Respuesta 200 OK con nueva URL del archivo y eliminación del archivo anterior | Media |

#### 2.5 Endpoint DELETE /api/candidates/:id

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| API-18 | Eliminar candidato existente | 1. Crear un candidato<br>2. Enviar una petición DELETE con el ID del candidato | Respuesta 200 OK con mensaje de confirmación | Media |
| API-19 | Eliminar candidato con ID inexistente | 1. Enviar una petición DELETE con un ID que no existe | Respuesta 404 Not Found con mensaje indicando que el candidato no existe | Media |
| API-20 | Eliminar candidato con archivo CV | 1. Crear un candidato con CV<br>2. Enviar una petición DELETE con el ID del candidato | Respuesta 200 OK y eliminación del archivo del sistema de archivos | Media |

### 3. Pruebas de Integración

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| INT-01 | Flujo completo de añadir candidato | 1. Acceder al formulario<br>2. Completar todos los campos<br>3. Cargar un CV<br>4. Enviar el formulario | El candidato se crea correctamente en la BD y se muestra mensaje de éxito | Alta |
| INT-02 | Validación de email duplicado | 1. Crear un candidato<br>2. Intentar crear otro con el mismo email | Se muestra mensaje de error indicando que el email ya existe | Alta |
| INT-03 | Carga y almacenamiento de CV | 1. Crear un candidato con CV<br>2. Verificar que el archivo se ha almacenado correctamente | El archivo se almacena en la ubicación correcta y la URL se guarda en la BD | Alta |
| INT-04 | Manejo de errores de servidor | 1. Provocar un error en el servidor<br>2. Verificar el manejo del error en el frontend | Se muestra un mensaje de error adecuado al usuario | Media |

### 4. Pruebas de Accesibilidad

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| ACC-01 | Navegación por teclado | 1. Acceder al formulario<br>2. Navegar usando solo el teclado (Tab, Enter, etc.) | Todos los elementos son accesibles y utilizables mediante teclado | Alta |
| ACC-02 | Etiquetas y atributos ARIA | 1. Inspeccionar el código HTML<br>2. Verificar etiquetas y atributos ARIA | Todos los elementos tienen etiquetas adecuadas y atributos ARIA cuando es necesario | Alta |
| ACC-03 | Contraste de colores | 1. Verificar el contraste entre texto y fondo | El contraste cumple con WCAG AA (4.5:1 para texto normal, 3:1 para texto grande) | Media |
| ACC-04 | Compatibilidad con lectores de pantalla | 1. Probar el formulario con un lector de pantalla | El formulario es utilizable con lectores de pantalla | Media |
| ACC-05 | Mensajes de error accesibles | 1. Provocar errores de validación<br>2. Verificar que los mensajes son accesibles | Los mensajes de error son anunciados por lectores de pantalla | Media |

### 5. Pruebas de Compatibilidad

| ID | Descripción | Pasos | Resultado Esperado | Prioridad |
|----|-------------|-------|-------------------|-----------|
| COMP-01 | Compatibilidad con Chrome | 1. Probar el formulario en Chrome | El formulario funciona correctamente | Alta |
| COMP-02 | Compatibilidad con Firefox | 1. Probar el formulario en Firefox | El formulario funciona correctamente | Alta |
| COMP-03 | Compatibilidad con Safari | 1. Probar el formulario en Safari | El formulario funciona correctamente | Media |
| COMP-04 | Compatibilidad con Edge | 1. Probar el formulario en Edge | El formulario funciona correctamente | Media |
| COMP-05 | Responsive en móvil | 1. Probar el formulario en dispositivos móviles | El formulario se adapta correctamente a pantallas pequeñas | Alta |
| COMP-06 | Responsive en tablet | 1. Probar el formulario en tablets | El formulario se adapta correctamente a pantallas medianas | Media |

## Datos de Prueba

### Candidatos Válidos

| Nombre | Apellido | Email | Teléfono | Dirección | Educación | Experiencia | CV |
|--------|----------|-------|----------|-----------|-----------|-------------|-----|
| Juan | Pérez | juan.perez@example.com | +34612345678 | Calle Principal 123 | Ingeniería Informática | 5 años como desarrollador | cv_juan.pdf |
| María | García | maria.garcia@example.com | +34698765432 | Avenida Secundaria 456 | Máster en Marketing | 3 años como especialista en marketing | cv_maria.docx |
| Carlos | López | carlos.lopez@example.com | | | | | |

### Datos Inválidos

| Campo | Valor | Razón |
|-------|-------|-------|
| Email | juanperez@com | Formato inválido |
| Email | juan.perez@example.com | Duplicado (si ya existe) |
| Nombre | | Campo obligatorio vacío |
| Apellido | | Campo obligatorio vacío |
| CV | imagen.jpg | Tipo de archivo no permitido |
| CV | documento_grande.pdf (6MB) | Tamaño excede el límite |

## Criterios de Aceptación

La funcionalidad de añadir candidatos se considerará aceptable cuando:

1. Todos los casos de prueba de prioridad Alta pasen con éxito
2. Al menos el 90% de los casos de prueba de prioridad Media pasen con éxito
3. No haya errores críticos o bloqueantes
4. La funcionalidad cumpla con los criterios de accesibilidad WCAG AA
5. La funcionalidad sea compatible con los navegadores principales

## Proceso de Reporte de Defectos

Los defectos encontrados durante las pruebas se reportarán siguiendo este formato:

- **ID**: Identificador único del defecto
- **Título**: Descripción breve del defecto
- **Descripción**: Descripción detallada del defecto
- **Pasos para reproducir**: Pasos específicos para reproducir el defecto
- **Resultado actual**: Lo que ocurre actualmente
- **Resultado esperado**: Lo que debería ocurrir
- **Severidad**: Crítica, Alta, Media, Baja
- **Prioridad**: Alta, Media, Baja
- **Ambiente**: Navegador, dispositivo, versión
- **Capturas de pantalla/Videos**: Evidencia visual del defecto

## Métricas de Calidad

Se utilizarán las siguientes métricas para evaluar la calidad:

1. **Cobertura de pruebas**: Porcentaje de código cubierto por pruebas unitarias (objetivo: >80%)
2. **Tasa de defectos**: Número de defectos por caso de prueba
3. **Densidad de defectos**: Número de defectos por línea de código
4. **Eficiencia de pruebas**: Número de defectos encontrados por hora de prueba
5. **Tiempo medio de resolución**: Tiempo promedio para resolver un defecto

## Cronograma de Pruebas

| Fase | Duración | Descripción |
|------|----------|-------------|
| Preparación | 1 día | Configuración del entorno, preparación de datos de prueba |
| Pruebas Unitarias | 2 días | Ejecución de pruebas unitarias para backend y frontend |
| Pruebas de Integración | 2 días | Ejecución de pruebas de integración |
| Pruebas de Accesibilidad | 1 día | Ejecución de pruebas de accesibilidad |
| Pruebas de Compatibilidad | 1 día | Ejecución de pruebas en diferentes navegadores y dispositivos |
| Reporte y Seguimiento | 1 día | Documentación de resultados y seguimiento de defectos |

## Riesgos y Mitigación

| Riesgo | Impacto | Probabilidad | Estrategia de Mitigación |
|--------|---------|--------------|--------------------------|
| Problemas de integración entre frontend y backend | Alto | Media | Realizar pruebas de integración tempranas y continuas |
| Problemas con el almacenamiento de archivos | Alto | Media | Probar exhaustivamente diferentes tipos y tamaños de archivos |
| Problemas de compatibilidad con navegadores | Medio | Baja | Probar en múltiples navegadores y versiones |
| Problemas de accesibilidad | Medio | Media | Realizar pruebas de accesibilidad desde el inicio |
| Datos de prueba insuficientes | Bajo | Baja | Preparar datos de prueba variados y representativos |

## Conclusión

Este plan de pruebas proporciona una estrategia completa para validar la funcionalidad de añadir candidatos al Sistema de Seguimiento de Talento (LTI). La ejecución de estas pruebas garantizará que la funcionalidad cumpla con los requisitos especificados y proporcione una experiencia de usuario satisfactoria. 