# Planificación del Sprint 2 - Correcciones y Mejoras de Experiencia de Usuario

## Resumen Ejecutivo

El Sprint 2 del proyecto LTI - Sistema de Seguimiento de Talento se enfocará en corregir los defectos identificados durante el Sprint 1, mejorar la experiencia de usuario en dispositivos móviles y optimizar el rendimiento general de la aplicación. Este documento detalla la planificación del sprint, incluyendo objetivos, tareas, asignaciones y criterios de aceptación.

**Período**: 15/03/2024 - 29/03/2024  
**Duración**: 2 semanas  
**Puntos de historia planificados**: 29  

## Objetivos del Sprint

1. Corregir los defectos de accesibilidad y compatibilidad identificados en el Sprint 1
2. Mejorar la experiencia de usuario en dispositivos móviles
3. Optimizar el rendimiento general de la aplicación
4. Implementar mejoras en el formulario de candidatos
5. Desarrollar y aplicar una guía de estilos consistente

## Backlog del Sprint

### Corrección de Defectos

1. **[SPRINT-02]-[FRONTEND_DEV]-[Corrección de Defectos de Accesibilidad]**
   - **Descripción**: Corregir los defectos de accesibilidad identificados en el Sprint 1 (DEF-002, DEF-003, DEF-004, DEF-005)
   - **Puntos de historia**: 3
   - **Prioridad**: Alta
   - **Asignado a**: Frontend Developer
   - **Dependencias**: Ninguna
   - **Criterios de aceptación**:
     - Todos los campos de formulario tienen etiquetas explícitas
     - Todos los iconos tienen texto alternativo
     - La estructura de encabezados es jerárquica y lógica
     - El componente de carga de archivos comunica su estado a lectores de pantalla

2. **[SPRINT-02]-[FRONTEND_DEV]-[Corrección de Defectos de Compatibilidad]**
   - **Descripción**: Corregir los defectos de compatibilidad identificados en el Sprint 1 (DEF-006, DEF-007, DEF-008, DEF-009)
   - **Puntos de historia**: 5
   - **Prioridad**: Alta
   - **Asignado a**: Frontend Developer
   - **Dependencias**: Ninguna
   - **Criterios de aceptación**:
     - La carga de archivos funciona correctamente en Safari iOS
     - La edición de CV funciona sin errores en Safari iOS
     - Los elementos de acción tienen suficiente espacio en vista móvil
     - El nombre del archivo se actualiza visualmente en Safari Desktop

3. **[SPRINT-02]-[BACKEND_DEV]-[Mejora de Mensajes de Error]**
   - **Descripción**: Mejorar los mensajes de error del servidor para proporcionar información más específica (DEF-001)
   - **Puntos de historia**: 2
   - **Prioridad**: Media
   - **Asignado a**: Backend Developer
   - **Dependencias**: Ninguna
   - **Criterios de aceptación**:
     - Los errores de conexión a la base de datos muestran mensajes específicos
     - Se implementa un sistema centralizado de manejo de errores
     - Los mensajes de error son claros y útiles para el usuario

### Mejoras de UX/UI

4. **[SPRINT-02]-[UX_UI_DESIGNER]-[Desarrollo de Guía de Estilos]**
   - **Descripción**: Desarrollar una guía de estilos completa para la aplicación basada en el ejemplo ATS UXUI
   - **Puntos de historia**: 5
   - **Prioridad**: Alta
   - **Asignado a**: UX/UI Designer
   - **Dependencias**: Ninguna
   - **Criterios de aceptación**:
     - Paleta de colores definida
     - Tipografía y jerarquía de textos
     - Componentes UI estandarizados (botones, campos, tarjetas, etc.)
     - Patrones de interacción
     - Guía de espaciado y layout
     - Consideraciones de accesibilidad documentadas

5. **[SPRINT-02]-[FRONTEND_DEV]-[Aplicación de Guía de Estilos]**
   - **Descripción**: Implementar la guía de estilos en los componentes existentes
   - **Puntos de historia**: 5
   - **Prioridad**: Alta
   - **Asignado a**: Frontend Developer
   - **Dependencias**: [SPRINT-02]-[UX_UI_DESIGNER]-[Desarrollo de Guía de Estilos]
   - **Criterios de aceptación**:
     - Todos los componentes siguen la guía de estilos
     - Interfaz consistente en toda la aplicación
     - Diseño responsive mejorado
     - Mejora visual general de la aplicación

### Mejoras del Formulario de Candidatos

6. **[SPRINT-02]-[DB_SENIOR]-[Actualización del Modelo de Datos]**
   - **Descripción**: Actualizar el modelo de datos para soportar campos estructurados de educación y experiencia laboral
   - **Puntos de historia**: 3
   - **Prioridad**: Alta
   - **Asignado a**: DB Senior
   - **Dependencias**: Ninguna
   - **Criterios de aceptación**:
     - Modelo de datos actualizado para educación (con fechas inicio/fin, descripción y detalles)
     - Modelo de datos actualizado para experiencia laboral (con fechas inicio/fin, descripción y detalles)
     - Migraciones creadas y documentadas
     - Actualización de campos obligatorios (teléfono, educación, experiencia laboral y CV)

7. **[SPRINT-02]-[BACKEND_DEV]-[Actualización de API para Campos Mejorados]**
   - **Descripción**: Actualizar la API para soportar los nuevos campos estructurados y validaciones
   - **Puntos de historia**: 3
   - **Prioridad**: Alta
   - **Asignado a**: Backend Developer
   - **Dependencias**: [SPRINT-02]-[DB_SENIOR]-[Actualización del Modelo de Datos]
   - **Criterios de aceptación**:
     - Endpoints actualizados para manejar datos estructurados
     - Validación de campos obligatorios implementada
     - Documentación de API actualizada
     - Pruebas de integración actualizadas

8. **[SPRINT-02]-[UX_UI_DESIGNER]-[Diseño de Campos Mejorados]**
   - **Descripción**: Diseñar la interfaz para los campos mejorados de educación y experiencia laboral
   - **Puntos de historia**: 3
   - **Prioridad**: Alta
   - **Asignado a**: UX/UI Designer
   - **Dependencias**: Ninguna
   - **Criterios de aceptación**:
     - Wireframes y mockups para campos de educación con funcionalidad de lista
     - Wireframes y mockups para campos de experiencia laboral con funcionalidad de lista
     - Diseño de componente de autocompletado
     - Diseño responsive para dispositivos móviles
     - Consideraciones de accesibilidad incluidas

9. **[SPRINT-02]-[FRONTEND_DEV]-[Implementación de Campos Mejorados]**
   - **Descripción**: Implementar los campos mejorados de educación y experiencia laboral con autocompletado
   - **Puntos de historia**: 5
   - **Prioridad**: Alta
   - **Asignado a**: Frontend Developer
   - **Dependencias**: [SPRINT-02]-[UX_UI_DESIGNER]-[Diseño de Campos Mejorados], [SPRINT-02]-[BACKEND_DEV]-[Actualización de API para Campos Mejorados]
   - **Criterios de aceptación**:
     - Campos de educación implementados como lista con fechas inicio/fin
     - Campos de experiencia laboral implementados como lista con fechas inicio/fin
     - Funcionalidad de autocompletado implementada
     - Validación de campos obligatorios
     - Interfaz responsive y accesible

### Optimización y Pruebas

10. **[SPRINT-02]-[ARCHITECT]-[Optimización de Rendimiento]**
    - **Descripción**: Identificar y resolver problemas de rendimiento en la aplicación
    - **Puntos de historia**: 3
    - **Prioridad**: Media
    - **Asignado a**: Architect
    - **Dependencias**: Ninguna
    - **Criterios de aceptación**:
      - Análisis de rendimiento completado
      - Optimizaciones implementadas para mejorar tiempos de carga
      - Optimizaciones de caché implementadas donde sea apropiado
      - Documentación de mejoras de rendimiento

11. **[SPRINT-02]-[BACKEND_DEV]-[Pruebas Unitarias para Cambios en Backend]**
    - **Descripción**: Actualizar y crear pruebas unitarias para los cambios en el backend
    - **Puntos de historia**: 2
    - **Prioridad**: Media
    - **Asignado a**: Backend Developer
    - **Dependencias**: [SPRINT-02]-[BACKEND_DEV]-[Actualización de API para Campos Mejorados]
    - **Criterios de aceptación**:
      - Cobertura de código >80% para los cambios
      - Pruebas para validación de campos obligatorios
      - Pruebas para manejo de datos estructurados
      - Integración con el sistema de CI/CD

12. **[SPRINT-02]-[FRONTEND_DEV]-[Pruebas Unitarias para Cambios en Frontend]**
    - **Descripción**: Actualizar y crear pruebas unitarias para los cambios en el frontend
    - **Puntos de historia**: 2
    - **Prioridad**: Media
    - **Asignado a**: Frontend Developer
    - **Dependencias**: [SPRINT-02]-[FRONTEND_DEV]-[Implementación de Campos Mejorados]
    - **Criterios de aceptación**:
      - Cobertura de código >80% para los cambios
      - Pruebas para componentes de educación y experiencia laboral
      - Pruebas para autocompletado
      - Pruebas para validación de campos obligatorios

13. **[SPRINT-02]-[QA]-[Verificación de Correcciones y Mejoras]**
    - **Descripción**: Verificar que los defectos han sido corregidos y las mejoras implementadas correctamente
    - **Puntos de historia**: 3
    - **Prioridad**: Alta
    - **Asignado a**: QA
    - **Dependencias**: Todas las tareas anteriores
    - **Criterios de aceptación**:
      - Informe de verificación de defectos
      - Pruebas de los campos mejorados
      - Pruebas de accesibilidad
      - Pruebas de compatibilidad en diferentes navegadores y dispositivos
      - Documentación actualizada

## Distribución de Puntos por Rol

| Rol | Tareas | Puntos de Historia | % del Sprint |
|-----|--------|-------------------|-------------|
| Architect | 1 | 3 | 10.3% |
| DB Senior | 1 | 3 | 10.3% |
| Backend Developer | 3 | 7 | 24.1% |
| Frontend Developer | 5 | 20 | 69.0% |
| UX/UI Designer | 2 | 8 | 27.6% |
| QA | 1 | 3 | 10.3% |
| **Total** | **13** | **29** | **100%** |

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Estrategia de Mitigación |
|--------|--------------|---------|--------------------------|
| Complejidad de la implementación de campos estructurados | Media | Alto | Comenzar con una implementación básica y añadir funcionalidades incrementalmente |
| Problemas de compatibilidad en Safari iOS | Alta | Medio | Realizar pruebas tempranas en dispositivos iOS reales y considerar enfoques alternativos |
| Sobrecarga de trabajo para el Frontend Developer | Alta | Medio | Considerar redistribuir algunas tareas o ajustar el alcance si es necesario |
| Impacto en datos existentes al cambiar campos obligatorios | Media | Alto | Planificar una estrategia de migración de datos y comunicación con usuarios |

## Dependencias Externas

- Disponibilidad de dispositivos iOS para pruebas de compatibilidad
- Acceso a herramientas de análisis de rendimiento

## Criterios de Aceptación del Sprint

El Sprint 2 se considerará exitoso si:

1. Todos los defectos identificados en el Sprint 1 han sido corregidos y verificados
2. La guía de estilos ha sido desarrollada y aplicada a los componentes existentes
3. Los campos de educación y experiencia laboral han sido mejorados con funcionalidad de lista y autocompletado
4. La validación de campos obligatorios ha sido implementada correctamente
5. La experiencia de usuario en dispositivos móviles ha mejorado significativamente
6. El rendimiento general de la aplicación ha mejorado
7. Las pruebas unitarias y de integración están implementadas con una cobertura >80%
8. La documentación está actualizada

## Métricas de Seguimiento

Durante el sprint, se realizará seguimiento de las siguientes métricas:

- Velocidad del equipo (puntos completados por semana)
- Burndown chart (puntos restantes vs. tiempo)
- Cobertura de código de pruebas
- Número de defectos identificados y resueltos
- Métricas de rendimiento (tiempo de carga, tiempo de respuesta)

## Reuniones Planificadas

- **Daily Scrum**: Todos los días a las 9:30 AM (15 minutos)
- **Sprint Review**: 29/03/2024 a las 10:00 AM (1 hora)
- **Sprint Retrospective**: 29/03/2024 a las 11:30 AM (1 hora)
- **Sprint Planning (Sprint 3)**: 29/03/2024 a las 2:00 PM (2 horas)

---

Documento preparado por: Scrum Master  
Fecha: 12/03/2024 