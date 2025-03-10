# Guía de Estilos - Sistema de Seguimiento de Talento LTI

Esta guía define los estándares de diseño para mantener una experiencia de usuario coherente, accesible y atractiva en toda la aplicación.

## 1. Paleta de Colores

### Colores Primarios
| Color | Hex | Uso |
|-------|-----|-----|
| ![Azul](https://via.placeholder.com/15/3B82F6/000000?text=+) Azul | `#3B82F6` | Color principal de la marca, botones primarios, enlaces |
| ![Verde](https://via.placeholder.com/15/10B981/000000?text=+) Verde | `#10B981` | Acciones positivas, confirmaciones, éxito |

### Colores Neutros
| Color | Hex | Uso |
|-------|-----|-----|
| ![Blanco](https://via.placeholder.com/15/FFFFFF/000000?text=+) Blanco | `#FFFFFF` | Fondos, tarjetas |
| ![Gris claro](https://via.placeholder.com/15/F3F4F6/000000?text=+) Gris claro | `#F3F4F6` | Fondos alternativos, bordes suaves |
| ![Gris medio](https://via.placeholder.com/15/9CA3AF/000000?text=+) Gris medio | `#9CA3AF` | Texto secundario, iconos inactivos |
| ![Gris oscuro](https://via.placeholder.com/15/4B5563/000000?text=+) Gris oscuro | `#4B5563` | Texto principal |
| ![Casi negro](https://via.placeholder.com/15/1F2937/000000?text=+) Casi negro | `#1F2937` | Títulos, énfasis |

### Colores de Estado
| Color | Hex | Uso |
|-------|-----|-----|
| ![Rojo](https://via.placeholder.com/15/EF4444/000000?text=+) Rojo | `#EF4444` | Errores, alertas críticas, eliminación |
| ![Ámbar](https://via.placeholder.com/15/F59E0B/000000?text=+) Ámbar | `#F59E0B` | Advertencias, acciones que requieren atención |
| ![Verde](https://via.placeholder.com/15/10B981/000000?text=+) Verde | `#10B981` | Éxito, confirmación, acciones completadas |
| ![Azul](https://via.placeholder.com/15/3B82F6/000000?text=+) Azul | `#3B82F6` | Información, ayuda |

## 2. Tipografía

### Fuentes
- **Principal**: Inter, sans-serif
- **Alternativa**: System UI, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

### Pesos
- **Regular**: 400 - Texto general
- **Medium**: 500 - Énfasis medio, subtítulos
- **Semibold**: 600 - Títulos, botones
- **Bold**: 700 - Énfasis fuerte

### Tamaños
| Nombre | Tamaño | Uso |
|--------|--------|-----|
| Display | 32px (2rem) | Títulos principales de página |
| H1 | 24px (1.5rem) | Títulos de sección |
| H2 | 20px (1.25rem) | Subtítulos |
| H3 | 18px (1.125rem) | Títulos de tarjetas |
| Body | 16px (1rem) | Texto general |
| Small | 14px (0.875rem) | Texto secundario, etiquetas |
| XSmall | 12px (0.75rem) | Notas, pies de página |

### Espaciado de Línea
- **Títulos**: 1.2
- **Cuerpo de texto**: 1.5
- **Texto pequeño**: 1.4

## 3. Componentes UI

### Botones

#### Primario
- Fondo: `#3B82F6` (Azul)
- Texto: `#FFFFFF` (Blanco)
- Borde: Ninguno
- Radio de borde: 6px
- Padding: 10px 16px
- Hover: Oscurecer 10%
- Active: Oscurecer 15%
- Disabled: Opacidad 50%

```html
<button class="btn btn-primary">Acción Principal</button>
```

#### Secundario
- Fondo: Transparente
- Texto: `#3B82F6` (Azul)
- Borde: 1px sólido `#3B82F6` (Azul)
- Radio de borde: 6px
- Padding: 10px 16px
- Hover: Fondo `rgba(59, 130, 246, 0.1)`
- Active: Fondo `rgba(59, 130, 246, 0.2)`
- Disabled: Opacidad 50%

```html
<button class="btn btn-secondary">Acción Secundaria</button>
```

#### Terciario
- Fondo: Transparente
- Texto: `#3B82F6` (Azul)
- Borde: Ninguno
- Padding: 10px 16px
- Hover: Fondo `rgba(59, 130, 246, 0.1)`
- Active: Fondo `rgba(59, 130, 246, 0.2)`
- Disabled: Opacidad 50%

```html
<button class="btn btn-tertiary">Acción Terciaria</button>
```

#### Peligro
- Fondo: `#EF4444` (Rojo)
- Texto: `#FFFFFF` (Blanco)
- Borde: Ninguno
- Radio de borde: 6px
- Padding: 10px 16px
- Hover: Oscurecer 10%
- Active: Oscurecer 15%
- Disabled: Opacidad 50%

```html
<button class="btn btn-danger">Eliminar</button>
```

### Campos de Formulario

#### Input Text
- Fondo: `#FFFFFF` (Blanco)
- Texto: `#4B5563` (Gris oscuro)
- Borde: 1px sólido `#D1D5DB` (Gris claro)
- Radio de borde: 6px
- Padding: 10px 12px
- Focus: Borde `#3B82F6` (Azul), sombra `0 0 0 3px rgba(59, 130, 246, 0.3)`
- Error: Borde `#EF4444` (Rojo), sombra `0 0 0 3px rgba(239, 68, 68, 0.3)`
- Disabled: Fondo `#F3F4F6` (Gris claro), opacidad texto 70%

```html
<div class="form-group">
  <label for="nombre" class="form-label">Nombre <span class="required">*</span></label>
  <input type="text" id="nombre" class="form-input" placeholder="Ingrese su nombre" />
  <span class="form-error">Este campo es obligatorio</span>
</div>
```

#### Select
- Apariencia similar a Input Text
- Icono de flecha hacia abajo en el lado derecho
- Opciones con hover `#F3F4F6` (Gris claro)
- Opción seleccionada con check o highlight

```html
<div class="form-group">
  <label for="pais" class="form-label">País</label>
  <select id="pais" class="form-select">
    <option value="">Seleccione un país</option>
    <option value="es">España</option>
    <option value="mx">México</option>
  </select>
</div>
```

#### Checkbox/Radio
- Tamaño: 18px x 18px
- Borde: 1px sólido `#D1D5DB` (Gris claro)
- Radio de borde: 4px (checkbox), 50% (radio)
- Checked: Fondo `#3B82F6` (Azul), check blanco
- Focus: Borde `#3B82F6` (Azul), sombra `0 0 0 3px rgba(59, 130, 246, 0.3)`
- Disabled: Fondo `#F3F4F6` (Gris claro), opacidad 70%

```html
<div class="form-check">
  <input type="checkbox" id="terminos" class="form-checkbox" />
  <label for="terminos" class="form-check-label">Acepto los términos y condiciones</label>
</div>
```

#### Textarea
- Apariencia similar a Input Text
- Altura mínima: 100px o 3 líneas
- Resize: vertical (predeterminado)

```html
<div class="form-group">
  <label for="descripcion" class="form-label">Descripción</label>
  <textarea id="descripcion" class="form-textarea" rows="4" placeholder="Describa brevemente..."></textarea>
</div>
```

#### File Upload
- Área de arrastrar y soltar: Borde punteado `#D1D5DB` (Gris claro)
- Fondo: `#F9FAFB` (Gris muy claro)
- Hover/Drag over: Borde `#3B82F6` (Azul), fondo `rgba(59, 130, 246, 0.1)`
- Texto instructivo centrado
- Botón de selección de archivo integrado
- Previsualización de archivos seleccionados

```html
<div class="form-group">
  <label class="form-label">CV (PDF o DOCX)</label>
  <div class="file-upload-area">
    <input type="file" id="cv" class="file-input" accept=".pdf,.docx" />
    <div class="file-upload-content">
      <p>Arrastra y suelta un archivo aquí, o</p>
      <button type="button" class="btn btn-secondary btn-sm">Seleccionar archivo</button>
    </div>
  </div>
  <div class="file-preview">
    <span class="file-name">cv_ejemplo.pdf</span>
    <button type="button" class="btn-icon btn-remove">×</button>
  </div>
</div>
```

### Tarjetas

#### Tarjeta Estándar
- Fondo: `#FFFFFF` (Blanco)
- Borde: Ninguno o 1px sólido `#E5E7EB` (Gris muy claro)
- Radio de borde: 8px
- Sombra: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- Padding: 16px
- Hover (opcional): Sombra aumentada

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título de la Tarjeta</h3>
  </div>
  <div class="card-body">
    Contenido de la tarjeta
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Acción</button>
  </div>
</div>
```

#### Tarjeta de Candidato
- Extensión de Tarjeta Estándar
- Imagen/Avatar: 48px x 48px, radio 50%
- Información principal destacada
- Acciones rápidas en la parte inferior o derecha

```html
<div class="card candidate-card">
  <div class="candidate-header">
    <div class="candidate-avatar">
      <img src="avatar.jpg" alt="Juan Pérez" />
    </div>
    <div class="candidate-info">
      <h3 class="candidate-name">Juan Pérez</h3>
      <p class="candidate-position">Desarrollador Full Stack</p>
    </div>
  </div>
  <div class="candidate-body">
    <div class="candidate-detail">
      <span class="detail-label">Email:</span>
      <span class="detail-value">juan.perez@example.com</span>
    </div>
    <!-- Más detalles -->
  </div>
  <div class="candidate-actions">
    <button class="btn btn-tertiary btn-sm">Ver</button>
    <button class="btn btn-primary btn-sm">Editar</button>
  </div>
</div>
```

## 4. Iconografía

Utilizamos [Heroicons](https://heroicons.com/) para mantener una apariencia consistente:

### Uso
- **Tamaño base**: 20px x 20px
- **Estilo de línea**: Para la mayoría de las acciones e indicadores
- **Estilo sólido**: Para estados activos, seleccionados o destacados

### Iconos Comunes
| Acción | Icono | Uso |
|--------|-------|-----|
| Añadir | Plus | Añadir nuevo elemento |
| Editar | Pencil | Modificar elemento existente |
| Eliminar | Trash | Eliminar elemento |
| Ver | Eye | Ver detalles |
| Buscar | Search | Búsqueda |
| Filtrar | Filter | Filtrar resultados |
| Ordenar | ArrowsUpDown | Cambiar orden |
| Descargar | Download | Descargar archivo |
| Subir | Upload | Subir archivo |
| Cerrar | X | Cerrar modal o alerta |
| Éxito | CheckCircle | Confirmación positiva |
| Error | XCircle | Error o problema |
| Info | InformationCircle | Información adicional |
| Advertencia | ExclamationTriangle | Advertencia |

```html
<button class="btn btn-icon">
  <svg class="icon"><!-- SVG de Heroicons --></svg>
  <span>Añadir</span>
</button>
```

## 5. Espaciado y Layout

### Sistema de Espaciado
| Nombre | Valor | Uso |
|--------|-------|-----|
| xs | 4px (0.25rem) | Espaciado mínimo, entre iconos y texto |
| sm | 8px (0.5rem) | Espaciado pequeño, padding interno de elementos compactos |
| md | 16px (1rem) | Espaciado estándar, margen entre elementos relacionados |
| lg | 24px (1.5rem) | Espaciado grande, separación entre secciones |
| xl | 32px (2rem) | Espaciado extra grande, margen superior/inferior de secciones |
| 2xl | 48px (3rem) | Espaciado máximo, separación entre bloques principales |

### Grid
- Sistema de 12 columnas
- Breakpoints:
  - **sm**: 640px
  - **md**: 768px
  - **lg**: 1024px
  - **xl**: 1280px
  - **2xl**: 1536px

### Contenedores
- **Máximo ancho**: 1280px
- **Padding lateral**:
  - Móvil: 16px
  - Tablet: 24px
  - Desktop: 32px

## 6. Animaciones y Transiciones

### Duración
- **Rápida**: 150ms - Feedback inmediato (hover, active)
- **Normal**: 300ms - Transiciones estándar (aparición, desaparición)
- **Lenta**: 500ms - Transiciones complejas (expansión, colapso)

### Curvas de Aceleración
- **Estándar**: `ease` - Para la mayoría de las transiciones
- **Entrada**: `ease-out` - Para elementos que aparecen
- **Salida**: `ease-in` - Para elementos que desaparecen
- **Suave**: `cubic-bezier(0.4, 0, 0.2, 1)` - Para transiciones más naturales

### Ejemplos
```css
/* Transición de botón */
.btn {
  transition: all 150ms ease;
}

/* Aparición de modal */
.modal {
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}

/* Expansión de acordeón */
.accordion-content {
  transition: max-height 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 7. Accesibilidad

### Contraste
- Texto normal: Ratio mínimo de 4.5:1
- Texto grande: Ratio mínimo de 3:1
- Elementos interactivos: Ratio mínimo de 3:1

### Foco
- Indicador de foco visible para todos los elementos interactivos
- No eliminar el outline sin proporcionar una alternativa visible
- Estilo de foco consistente: Borde azul con sombra

### Etiquetas y Textos Alternativos
- Todos los campos de formulario deben tener etiquetas visibles
- Todas las imágenes deben tener texto alternativo descriptivo
- Los iconos funcionales deben tener texto accesible (visible o aria-label)

### Navegación por Teclado
- Todos los elementos interactivos deben ser accesibles mediante teclado
- Orden de tabulación lógico (tab-index)
- Atajos de teclado para acciones comunes (con aria-keyshortcuts)

### ARIA
- Usar roles ARIA apropiados para componentes personalizados
- Implementar aria-live para actualizaciones dinámicas
- Usar aria-expanded, aria-selected, aria-checked según corresponda

## 8. Responsive Design

### Enfoque Mobile-First
- Diseñar primero para dispositivos móviles
- Adaptar progresivamente para pantallas más grandes
- Usar media queries para ajustar el diseño

### Imágenes Responsivas
- Usar `max-width: 100%` para imágenes
- Considerar diferentes resoluciones con `srcset`
- Usar imágenes de fondo con `background-size: cover` cuando sea apropiado

### Tipografía Fluida
- Tamaños de fuente más pequeños en móvil
- Aumentar progresivamente en pantallas más grandes
- Considerar el uso de unidades viewport (vw) para escalado fluido

### Componentes Adaptables
- Tarjetas: 1 columna en móvil, 2-3 en tablet, 3-4 en desktop
- Navegación: Menú hamburguesa en móvil, barra horizontal en desktop
- Formularios: Campos apilados en móvil, en columnas en desktop

## 9. Principios de Diseño

1. **Consistencia**: Mantener patrones coherentes en toda la interfaz
2. **Jerarquía**: Establecer una clara jerarquía visual de información
3. **Feedback**: Proporcionar retroalimentación clara para todas las acciones
4. **Eficiencia**: Minimizar los pasos necesarios para completar tareas
5. **Forgiving**: Permitir deshacer acciones y corregir errores fácilmente
6. **Accesibilidad**: Diseñar para todos los usuarios, independientemente de sus capacidades
7. **Simplicidad**: Mantener la interfaz lo más simple posible sin sacrificar funcionalidad

## 10. Implementación

Esta guía de estilos se implementa a través de:

1. **Variables CSS**: Para colores, tipografía y espaciado
2. **Clases de utilidad**: Para aplicar estilos comunes rápidamente
3. **Componentes**: Implementaciones consistentes de los elementos de UI
4. **Documentación**: Ejemplos y guías de uso para desarrolladores

### Ejemplo de Variables CSS
```css
:root {
  /* Colores */
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --color-white: #FFFFFF;
  --color-gray-100: #F3F4F6;
  --color-gray-400: #9CA3AF;
  --color-gray-700: #4B5563;
  --color-gray-900: #1F2937;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-success: #10B981;
  --color-info: #3B82F6;
  
  /* Tipografía */
  --font-family: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  
  /* Espaciado */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Bordes */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-full: 9999px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
``` 