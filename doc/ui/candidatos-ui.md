# Diseño UI para Gestión de Candidatos

Este documento describe los componentes de interfaz de usuario para la funcionalidad de añadir candidatos al Sistema de Seguimiento de Talento (LTI).

## Componentes Principales

### 1. Formulario de Candidato

El formulario de candidato es el componente principal para añadir y editar candidatos en el sistema.

#### Características

- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla.
- **Validación en Tiempo Real**: Muestra errores de validación mientras el usuario completa el formulario.
- **Accesibilidad**: Cumple con los estándares WCAG para accesibilidad.
- **Mensajes de Feedback**: Muestra mensajes de éxito o error después de enviar el formulario.

#### Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Nombre | Texto | Sí | Nombre del candidato |
| Apellido | Texto | Sí | Apellido del candidato |
| Email | Email | Sí | Correo electrónico (único) |
| Teléfono | Texto | No | Número de teléfono |
| Dirección | Texto | No | Dirección postal |
| Educación | Área de texto | No | Información educativa |
| Experiencia Laboral | Área de texto | No | Experiencia laboral |
| CV | Archivo | No | Documento PDF o DOCX (máx. 5MB) |

#### Mockup

```
+------------------------------------------+
|           Añadir Nuevo Candidato         |
+------------------------------------------+
| +---------------+ +-------------------+  |
| | Nombre*       | | Apellido*         |  |
| | [          ]  | | [              ]  |  |
| +---------------+ +-------------------+  |
|                                          |
| +----------------------------------+     |
| | Email*                           |     |
| | [                             ]  |     |
| +----------------------------------+     |
|                                          |
| +---------------+ +-------------------+  |
| | Teléfono      | | Dirección         |  |
| | [          ]  | | [              ]  |  |
| +---------------+ +-------------------+  |
|                                          |
| +----------------------------------+     |
| | Educación                        |     |
| | [                             ]  |     |
| | [                             ]  |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | Experiencia Laboral              |     |
| | [                             ]  |     |
| | [                             ]  |     |
| +----------------------------------+     |
|                                          |
| +----------------------------------+     |
| | CV (PDF o DOCX, máx. 5MB)        |     |
| | [Seleccionar archivo] o arrastrar|     |
| +----------------------------------+     |
|                                          |
| +----------+  +---------------------+    |
| | Cancelar |  | Añadir Candidato    |    |
| +----------+  +---------------------+    |
+------------------------------------------+
```

### 2. Componente de Carga de Archivos

Componente especializado para la carga de archivos CV.

#### Características

- **Drag & Drop**: Permite arrastrar y soltar archivos.
- **Validación de Tipo**: Acepta solo archivos PDF y DOCX.
- **Validación de Tamaño**: Limita el tamaño a 5MB.
- **Previsualización**: Muestra el nombre del archivo seleccionado.
- **Eliminación**: Permite eliminar el archivo seleccionado.

#### Mockup

```
+------------------------------------------+
|                                          |
|     Arrastra y suelta un archivo aquí    |
|                  o                       |
|         [Seleccionar archivo]            |
|                                          |
+------------------------------------------+
| Formatos permitidos: PDF, DOCX           |
| Tamaño máximo: 5MB                       |
+------------------------------------------+
```

### 3. Componente de Alerta

Componente para mostrar mensajes de éxito, error, advertencia o información.

#### Características

- **Tipos de Alerta**: Éxito, Error, Advertencia, Información.
- **Auto-cierre**: Opción para cerrar automáticamente después de un tiempo.
- **Cierre Manual**: Botón para cerrar manualmente.
- **Iconos**: Iconos visuales según el tipo de alerta.

#### Mockup

```
+------------------------------------------+
| ✓ | Candidato añadido correctamente      X |
+------------------------------------------+

+------------------------------------------+
| ✗ | Error: El email ya existe            X |
+------------------------------------------+
```

## Flujo de Usuario

1. **Acceso al Formulario**:
   - El usuario navega a la página "Añadir Candidato" desde el menú principal.

2. **Completar Formulario**:
   - El usuario completa los campos requeridos y opcionales.
   - Se muestran errores de validación en tiempo real.

3. **Subir CV**:
   - El usuario puede arrastrar y soltar un archivo o usar el botón para seleccionarlo.
   - Se valida el tipo y tamaño del archivo.

4. **Enviar Formulario**:
   - El usuario hace clic en "Añadir Candidato".
   - Se muestra un indicador de carga durante el proceso.

5. **Recibir Feedback**:
   - Se muestra un mensaje de éxito o error según el resultado.
   - En caso de éxito, se limpia el formulario o se redirige a otra página.
   - En caso de error, se mantienen los datos ingresados y se muestra el mensaje de error.

## Paleta de Colores

- **Primario**: #3B82F6 (Azul)
- **Éxito**: #10B981 (Verde)
- **Error**: #EF4444 (Rojo)
- **Advertencia**: #F59E0B (Amarillo)
- **Información**: #3B82F6 (Azul)
- **Texto Principal**: #1F2937 (Gris oscuro)
- **Texto Secundario**: #6B7280 (Gris medio)
- **Fondo**: #F3F4F6 (Gris claro)
- **Borde**: #E5E7EB (Gris más claro)

## Tipografía

- **Familia**: Inter, system-ui, sans-serif
- **Tamaños**:
  - Título principal: 24px (1.5rem)
  - Subtítulos: 18px (1.125rem)
  - Texto normal: 16px (1rem)
  - Texto pequeño: 14px (0.875rem)
  - Texto muy pequeño: 12px (0.75rem)

## Consideraciones de Accesibilidad

- **Contraste**: Todos los textos cumplen con una relación de contraste mínima de 4.5:1.
- **Teclado**: Todos los elementos interactivos son accesibles mediante teclado.
- **Etiquetas**: Todos los campos tienen etiquetas visibles y asociadas correctamente.
- **Mensajes de Error**: Los errores se comunican de manera clara y están asociados a sus campos correspondientes.
- **ARIA**: Se utilizan atributos ARIA cuando es necesario para mejorar la accesibilidad.

## Responsive Design

- **Móvil** (<768px):
  - Formulario en una sola columna.
  - Campos ocupan el ancho completo.
  - Botones apilados verticalmente.

- **Tablet** (768px - 1024px):
  - Formulario en dos columnas para algunos campos.
  - Botones en línea.

- **Desktop** (>1024px):
  - Formulario en dos columnas para la mayoría de los campos.
  - Máximo ancho de 800px para mejor legibilidad.

## Componentes Tailwind CSS

El diseño se implementa utilizando Tailwind CSS con los siguientes componentes principales:

- **Contenedores**: `container`, `mx-auto`, `px-4`, `py-8`
- **Formularios**: `form`, `input`, `textarea`, `label`, `select`
- **Botones**: `button`, `bg-blue-600`, `text-white`, `px-4`, `py-2`, `rounded-md`
- **Alertas**: `border-l-4`, `p-4`, `mb-4`, `rounded-md`
- **Flexbox**: `flex`, `flex-col`, `items-center`, `justify-center`
- **Grid**: `grid`, `grid-cols-1`, `md:grid-cols-2`, `gap-4`
- **Espaciado**: `space-y-4`, `space-x-3`, `mt-6`, `mb-4`
- **Bordes**: `border`, `border-gray-300`, `rounded-md`
- **Sombras**: `shadow-sm`, `shadow-md`
- **Estados**: `hover:bg-blue-700`, `focus:ring-2`, `focus:ring-blue-500` 