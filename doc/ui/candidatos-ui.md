# Diseño UI para Gestión de Candidatos

Este documento describe los componentes de interfaz de usuario para la funcionalidad de añadir candidatos al Sistema de Seguimiento de Talento (LTI).

## Componentes Principales

### 1. Formulario de Candidato

El formulario de candidato es el componente principal para añadir y editar candidatos en el sistema. Se ha implementado siguiendo la guía de estilos definida en `doc/ui/style-guide.md`.

#### Características

- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla con un diseño fluido.
- **Validación en Tiempo Real**: Muestra errores de validación mientras el usuario completa el formulario.
- **Accesibilidad**: Cumple con los estándares WCAG para accesibilidad, incluyendo etiquetas adecuadas, contraste y navegación por teclado.
- **Mensajes de Feedback**: Muestra mensajes de éxito o error después de enviar el formulario.
- **Experiencia Mejorada**: Campos avanzados para educación, experiencia laboral y carga de CV.

#### Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Nombre | Texto | Sí | Nombre del candidato |
| Apellido | Texto | Sí | Apellido del candidato |
| Email | Email | Sí | Correo electrónico (único) |
| Teléfono | Texto | No | Número de teléfono |
| CV | Archivo | Sí | Documento PDF o DOCX (máx. 5MB) con carga interactiva |
| Educación | Componente | Sí | Múltiples registros educativos con arrastrar y soltar |
| Experiencia Laboral | Componente | No | Múltiples experiencias laborales con cálculo de duración |
| Habilidades | Texto | No | Lista de habilidades separadas por comas |
| Notas | Área de texto | No | Información adicional sobre el candidato |

#### Implementación

El formulario se ha implementado como un componente React (`CandidateForm.tsx`) que integra varios componentes especializados:

```jsx
<CandidateForm
  initialData={candidateData}
  onSubmit={handleSubmit}
  isLoading={isSubmitting}
/>
```

### 2. Componente de Educación

Componente especializado para gestionar múltiples registros educativos.

#### Características

- **Gestión de Múltiples Registros**: Permite añadir, editar y eliminar registros educativos.
- **Arrastrar y Soltar**: Permite reordenar los registros mediante arrastrar y soltar.
- **Validación Integrada**: Valida campos obligatorios y formatos de fecha.
- **Opción "Actualmente Estudiando"**: Deshabilita la fecha de fin cuando está seleccionada.
- **Interfaz Intuitiva**: Muestra los registros en tarjetas con acciones claras.

#### Implementación

```jsx
<EducationField
  value={education}
  onChange={handleEducationChange}
  required={true}
/>
```

### 3. Componente de Experiencia Laboral

Componente especializado para gestionar múltiples experiencias laborales.

#### Características

- **Gestión de Múltiples Registros**: Permite añadir, editar y eliminar experiencias laborales.
- **Arrastrar y Soltar**: Permite reordenar los registros mediante arrastrar y soltar.
- **Cálculo Automático de Duración**: Muestra la duración de cada experiencia (ej. "2 años y 3 meses").
- **Opción "Trabajo Actual"**: Deshabilita la fecha de fin cuando está seleccionada.
- **Validación Integrada**: Valida campos obligatorios y coherencia de fechas.

#### Implementación

```jsx
<WorkExperienceField
  value={workExperience}
  onChange={handleWorkExperienceChange}
  required={false}
/>
```

### 4. Componente de Carga de CV

Componente especializado para la carga de archivos CV con una experiencia mejorada.

#### Características

- **Drag & Drop**: Permite arrastrar y soltar archivos directamente.
- **Validación de Tipo**: Acepta solo archivos PDF y DOCX.
- **Validación de Tamaño**: Limita el tamaño a 5MB.
- **Previsualización**: Muestra el nombre, tamaño y tipo del archivo seleccionado.
- **Barra de Progreso**: Muestra el progreso durante la carga.
- **Acciones**: Permite ver y eliminar el archivo seleccionado.

#### Implementación

```jsx
<FileUploadField
  value={cv}
  onChange={handleCvChange}
  required={true}
  acceptedFileTypes=".pdf,.doc,.docx"
  maxSizeMB={5}
  label="Curriculum Vitae (CV)"
/>
```

## Estilos y Diseño Visual

### Paleta de Colores

Se utiliza la paleta definida en la guía de estilos:

- **Primario**: #3B82F6 (Azul) - Botones principales, acentos
- **Secundario**: #10B981 (Verde) - Acciones positivas, éxito
- **Error**: #EF4444 (Rojo) - Errores, validaciones
- **Neutros**: Escala de grises para texto y fondos

### Tipografía

- **Familia**: Inter, system-ui, sans-serif
- **Tamaños**:
  - Título principal: 24px (1.5rem)
  - Subtítulos: 18px (1.125rem)
  - Texto normal: 16px (1rem)
  - Texto pequeño: 14px (0.875rem)

### Componentes Visuales

- **Tarjetas**: Fondos blancos con sombras suaves y bordes redondeados
- **Botones**: Primarios (azul sólido), secundarios (contorno azul)
- **Campos de Formulario**: Bordes ligeros con estados de foco y error claramente diferenciados
- **Iconos**: Uso consistente de iconos para acciones comunes (editar, eliminar, añadir)

## Flujo de Usuario

1. **Acceso al Formulario**:
   - El usuario navega a la página "Añadir Candidato" desde el menú principal.

2. **Completar Información Personal**:
   - El usuario completa los campos básicos (nombre, apellido, email, teléfono).
   - Se muestran errores de validación en tiempo real.

3. **Subir CV**:
   - El usuario arrastra y suelta un archivo o usa el botón para seleccionarlo.
   - Se muestra una barra de progreso durante la carga.
   - Se valida el tipo y tamaño del archivo.

4. **Gestionar Educación**:
   - El usuario añade uno o más registros educativos.
   - Puede reordenarlos mediante arrastrar y soltar.
   - Cada registro muestra la institución, grado, fechas y descripción.

5. **Gestionar Experiencia Laboral**:
   - El usuario añade experiencias laborales (opcional).
   - Puede marcar su trabajo actual.
   - Se calcula automáticamente la duración de cada experiencia.

6. **Añadir Información Adicional**:
   - El usuario añade habilidades y notas opcionales.

7. **Enviar Formulario**:
   - El usuario hace clic en "Guardar Candidato".
   - Se muestra un indicador de carga durante el proceso.
   - Se muestra un mensaje de éxito o error según el resultado.

## Responsive Design

- **Móvil** (<768px):
  - Formulario en una sola columna.
  - Campos ocupan el ancho completo.
  - Botones apilados verticalmente.
  - Acciones de formulario en orden inverso (principal arriba).

- **Tablet y Desktop** (≥768px):
  - Formulario en dos columnas para algunos campos.
  - Botones en línea con alineación a la derecha.
  - Máximo ancho de 800px para mejor legibilidad.

## Consideraciones de Accesibilidad

- **Contraste**: Todos los textos cumplen con una relación de contraste mínima de 4.5:1.
- **Teclado**: Todos los elementos interactivos son accesibles mediante teclado.
- **Etiquetas**: Todos los campos tienen etiquetas visibles y asociadas correctamente.
- **Mensajes de Error**: Los errores se comunican de manera clara y están asociados a sus campos correspondientes.
- **ARIA**: Se utilizan atributos ARIA cuando es necesario para mejorar la accesibilidad.

## Implementación Técnica

### Componentes React

- **CandidateForm**: Componente principal que integra todos los demás.
- **EducationField**: Gestión de registros educativos.
- **WorkExperienceField**: Gestión de experiencias laborales.
- **FileUploadField**: Carga de archivos con previsualización.

### Estilos CSS

Los estilos se implementan mediante archivos CSS modulares:

- **variables.css**: Variables CSS globales (colores, espaciado, tipografía).
- **CandidateForm.css**: Estilos para el formulario principal.
- **EducationField.css**: Estilos para el componente de educación.
- **WorkExperienceField.css**: Estilos para el componente de experiencia laboral.
- **FileUploadField.css**: Estilos para el componente de carga de archivos.

### Validación

- Validación en tiempo real para feedback inmediato.
- Validación en el envío para garantizar datos completos.
- Mensajes de error específicos por campo.
- Indicadores visuales claros para campos con error.

## Próximas Mejoras

- **Guardado Automático**: Implementar guardado de borradores automático.
- **Importación de Datos**: Permitir importar datos desde LinkedIn o archivos CV.
- **Autocompletado Mejorado**: Implementar sugerencias basadas en datos históricos.
- **Vista Previa de CV**: Mostrar una vista previa del contenido del CV.
- **Modo Oscuro**: Implementar soporte completo para modo oscuro. 