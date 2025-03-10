# Plan de Migración a Tailwind CSS

## Problema Identificado

Actualmente, el proyecto mezcla diferentes enfoques de estilo:

1. **Clases de Tailwind CSS** - Algunos componentes como `Alert.tsx` y `Button.tsx` ya utilizan clases de Tailwind directamente.
2. **Archivos CSS personalizados** - Componentes como `CandidateForm`, `EducationField`, etc. utilizan archivos CSS separados.
3. **Variables CSS** - Se utilizan variables CSS (--color-primary, --space-md, etc.) en los archivos CSS personalizados.

Esta mezcla de enfoques genera inconsistencias visuales, dificulta el mantenimiento y no aprovecha completamente las ventajas de Tailwind CSS.

## Objetivos

1. Migrar todos los componentes para que utilicen exclusivamente clases de Tailwind CSS
2. Eliminar los archivos CSS personalizados
3. Mantener la coherencia visual según la guía de estilos definida
4. Mejorar la mantenibilidad del código

## Estrategia de Migración

### Fase 1: Preparación

1. Verificar que la configuración de Tailwind CSS (`tailwind.config.js`) incluya todos los colores, tamaños, espaciados, etc. definidos en la guía de estilos
2. Crear un archivo de utilidades de Tailwind para patrones comunes (si es necesario)

### Fase 2: Migración de Componentes Comunes

Migrar los componentes base en el siguiente orden:

1. `FormField.tsx`
2. `Input.tsx`
3. `Select.tsx`
4. `TextArea.tsx`
5. `Checkbox.tsx`
6. `Card.tsx`

### Fase 3: Migración de Componentes de Formulario Complejos

1. `SkillsField.tsx`
2. `FileUploadField.tsx`
3. `EducationField.tsx`
4. `WorkExperienceField.tsx`

### Fase 4: Migración de Componentes de Candidatos

1. `CandidateCard.tsx`
2. `CandidateForm.tsx`
3. `FileUpload.tsx`

### Fase 5: Limpieza

1. Eliminar archivos CSS personalizados
2. Eliminar importaciones de archivos CSS no utilizados
3. Actualizar la documentación

## Guía de Conversión

Para cada componente, seguir estos pasos:

1. Identificar los estilos CSS actuales
2. Encontrar las clases equivalentes en Tailwind CSS
3. Reemplazar las clases personalizadas por clases de Tailwind
4. Probar el componente para asegurar que mantiene la apariencia correcta

### Ejemplo de Conversión

**Antes (con CSS personalizado):**
```jsx
<div className="form-group">
  <label className="form-label">Nombre</label>
  <input className="form-input" />
</div>
```

**Después (con Tailwind):**
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
  <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
</div>
```

## Cronograma

- Fase 1: 1 día
- Fase 2: 2 días
- Fase 3: 3 días
- Fase 4: 2 días
- Fase 5: 1 día

**Total: 9 días laborables**

## Riesgos y Mitigación

- **Riesgo**: Inconsistencias visuales durante la migración
  - **Mitigación**: Migrar componente por componente y probar cada uno antes de continuar

- **Riesgo**: Pérdida de funcionalidad específica de CSS
  - **Mitigación**: Identificar casos donde Tailwind no proporcione una solución directa y crear utilidades personalizadas

- **Riesgo**: Tiempo de migración mayor al estimado
  - **Mitigación**: Priorizar los componentes más utilizados y visibles 