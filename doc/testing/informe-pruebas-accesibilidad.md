# Informe de Pruebas de Accesibilidad - Sistema LTI

## Resumen Ejecutivo

Este documento presenta los resultados de las pruebas de accesibilidad realizadas para el Sistema de Seguimiento de Talento (LTI), con enfoque en la funcionalidad de gestión de candidatos. Las pruebas se han realizado siguiendo las pautas WCAG 2.1 nivel AA.

**Fecha de ejecución**: 10/03/2024  
**Versión probada**: 1.0.0  
**Entorno**: Desarrollo  
**Ejecutado por**: Equipo de QA  
**Herramientas utilizadas**: Lighthouse, axe DevTools, NVDA Screen Reader

## Resultados Generales

| Criterio | Puntuación | Estado |
|----------|------------|--------|
| Perceptible | 85% | ⚠️ Parcial |
| Operable | 90% | ✅ Aprobado |
| Comprensible | 95% | ✅ Aprobado |
| Robusto | 80% | ⚠️ Parcial |
| **Puntuación global** | **87.5%** | ⚠️ **Parcial** |

## Detalle de Pruebas

### ACC-01: Contraste de color
**Estado**: ✅ APROBADO  
**Criterio WCAG**: 1.4.3 Contraste (Mínimo)  
**Descripción**: Verificar que el contraste entre el texto y el fondo cumple con los requisitos mínimos.  
**Resultado**: El contraste de color en la mayoría de los elementos cumple con la relación 4.5:1 para texto normal y 3:1 para texto grande.  
**Observaciones**: Se utilizó la herramienta Lighthouse para verificar el contraste.

### ACC-02: Navegación por teclado
**Estado**: ✅ APROBADO  
**Criterio WCAG**: 2.1.1 Teclado  
**Descripción**: Verificar que todas las funcionalidades están disponibles mediante teclado.  
**Resultado**: Todas las funcionalidades principales son accesibles mediante teclado. El orden de tabulación es lógico y el foco visible.  
**Observaciones**: Se probó la navegación completa del formulario de candidatos utilizando solo el teclado.

### ACC-03: Etiquetas de formulario
**Estado**: ⚠️ PARCIAL  
**Criterio WCAG**: 1.3.1 Información y Relaciones, 3.3.2 Etiquetas o Instrucciones  
**Descripción**: Verificar que todos los campos de formulario tienen etiquetas asociadas correctamente.  
**Resultado**: La mayoría de los campos tienen etiquetas correctamente asociadas, pero se encontraron 2 campos sin etiqueta explícita.  
**Observaciones**: Los campos de "Educación" y "Experiencia laboral" utilizan placeholder como única forma de identificación, lo cual no es suficiente para accesibilidad.

### ACC-04: Mensajes de error
**Estado**: ✅ APROBADO  
**Criterio WCAG**: 3.3.1 Identificación de Errores, 3.3.3 Sugerencia ante Error  
**Descripción**: Verificar que los mensajes de error son claros y accesibles.  
**Resultado**: Los mensajes de error son claros, específicos y están asociados visualmente y programáticamente con los campos correspondientes.  
**Observaciones**: Los errores se muestran en color rojo con un icono, pero también incluyen texto descriptivo y están anunciados por lectores de pantalla.

### ACC-05: Estructura de encabezados
**Estado**: ⚠️ PARCIAL  
**Criterio WCAG**: 1.3.1 Información y Relaciones, 2.4.6 Encabezados y Etiquetas  
**Descripción**: Verificar que la página utiliza una estructura de encabezados lógica y jerárquica.  
**Resultado**: La estructura de encabezados es generalmente correcta, pero se encontraron saltos en la jerarquía (de H1 a H3 sin H2).  
**Observaciones**: En la página de listado de candidatos, se salta de H1 a H3 en algunas secciones.

### ACC-06: Textos alternativos
**Estado**: ❌ FALLIDO  
**Criterio WCAG**: 1.1.1 Contenido no textual  
**Descripción**: Verificar que todas las imágenes tienen texto alternativo adecuado.  
**Resultado**: Varias imágenes, incluyendo los iconos de acción en la tabla de candidatos, no tienen texto alternativo.  
**Observaciones**: Los botones de editar, eliminar y ver detalles utilizan iconos sin texto alternativo, lo que dificulta su comprensión por lectores de pantalla.

### ACC-07: Compatibilidad con lectores de pantalla
**Estado**: ⚠️ PARCIAL  
**Criterio WCAG**: 4.1.2 Nombre, Función, Valor  
**Descripción**: Verificar que todos los elementos interactivos son anunciados correctamente por lectores de pantalla.  
**Resultado**: La mayoría de los elementos son anunciados correctamente, pero algunos componentes personalizados no comunican su estado o función.  
**Observaciones**: El componente de carga de archivos no comunica adecuadamente el estado de la carga a los lectores de pantalla.

## Defectos Encontrados

### DEF-002: Falta de etiquetas en campos de formulario
**Severidad**: Alta  
**Prioridad**: Alta  
**Descripción**: Los campos "Educación" y "Experiencia laboral" en el formulario de candidatos utilizan placeholder como única forma de identificación, sin etiquetas explícitas.  
**Criterio WCAG**: 1.3.1 Información y Relaciones, 3.3.2 Etiquetas o Instrucciones  
**Impacto**: Usuarios con lectores de pantalla no pueden identificar correctamente el propósito de estos campos.  
**Solución recomendada**: Añadir elementos `<label>` asociados a estos campos mediante el atributo `for`.

### DEF-003: Iconos sin texto alternativo
**Severidad**: Alta  
**Prioridad**: Alta  
**Descripción**: Los iconos de acción (editar, eliminar, ver detalles) en la tabla de candidatos no tienen texto alternativo.  
**Criterio WCAG**: 1.1.1 Contenido no textual  
**Impacto**: Usuarios con lectores de pantalla no pueden identificar la función de estos botones.  
**Solución recomendada**: Añadir atributo `aria-label` o `title` a estos botones con una descripción clara de su función.

### DEF-004: Saltos en la jerarquía de encabezados
**Severidad**: Media  
**Prioridad**: Media  
**Descripción**: En la página de listado de candidatos, la estructura de encabezados salta de H1 a H3 sin utilizar H2.  
**Criterio WCAG**: 1.3.1 Información y Relaciones, 2.4.6 Encabezados y Etiquetas  
**Impacto**: Dificulta la navegación para usuarios de lectores de pantalla que utilizan los encabezados para navegar.  
**Solución recomendada**: Revisar y corregir la estructura de encabezados para mantener una jerarquía lógica.

### DEF-005: Componente de carga de archivos no accesible
**Severidad**: Media  
**Prioridad**: Media  
**Descripción**: El componente de carga de archivos no comunica su estado a los lectores de pantalla.  
**Criterio WCAG**: 4.1.2 Nombre, Función, Valor  
**Impacto**: Usuarios con lectores de pantalla no reciben feedback sobre el estado de la carga.  
**Solución recomendada**: Implementar `aria-live` para anunciar cambios de estado y mejorar los mensajes de feedback.

## Recomendaciones

1. **Etiquetas explícitas**: Añadir etiquetas explícitas a todos los campos de formulario, evitando depender solo de placeholders.
2. **Textos alternativos**: Asegurar que todas las imágenes e iconos tienen textos alternativos descriptivos.
3. **Estructura de encabezados**: Revisar y corregir la estructura de encabezados para mantener una jerarquía lógica.
4. **Mejora de componentes personalizados**: Mejorar la accesibilidad de componentes personalizados, especialmente el de carga de archivos.
5. **Pruebas con usuarios reales**: Realizar pruebas con usuarios que utilicen tecnologías de asistencia para validar las mejoras.

## Plan de Acción

| Defecto | Responsable | Fecha límite | Prioridad |
|---------|-------------|--------------|-----------|
| DEF-002 | Frontend Dev | 15/03/2024 | Alta |
| DEF-003 | Frontend Dev | 15/03/2024 | Alta |
| DEF-004 | Frontend Dev | 20/03/2024 | Media |
| DEF-005 | Frontend Dev | 20/03/2024 | Media |

## Conclusión

El Sistema de Seguimiento de Talento (LTI) cumple parcialmente con los criterios de accesibilidad WCAG 2.1 nivel AA. Se han identificado varias áreas de mejora, principalmente relacionadas con etiquetas de formulario, textos alternativos y estructura de encabezados.

Las funcionalidades principales son accesibles mediante teclado y los mensajes de error están bien implementados, lo que representa una base sólida. Sin embargo, es necesario abordar los defectos identificados para garantizar que el sistema sea completamente accesible para todos los usuarios, incluidos aquellos que utilizan tecnologías de asistencia.

Se recomienda implementar las correcciones propuestas y realizar pruebas adicionales con usuarios reales que utilicen tecnologías de asistencia para validar las mejoras. 