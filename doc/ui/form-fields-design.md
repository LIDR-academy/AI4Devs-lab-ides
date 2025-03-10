# Diseño Mejorado de Campos - Sistema de Seguimiento de Talento LTI

Este documento detalla el diseño mejorado para los campos de formulario específicos del Sistema de Seguimiento de Talento LTI, con especial énfasis en los campos de Educación, Experiencia Laboral y Carga de CV.

## 1. Campo de Educación

El campo de educación ha sido rediseñado para permitir la gestión de múltiples registros educativos de manera intuitiva y eficiente.

### Diseño Visual

![Campo de Educación](https://via.placeholder.com/800x400/ffffff/333333?text=Campo+de+Educacion)

### Características Principales

#### 1.1 Estructura del Componente

```jsx
<EducationField
  value={educationList}
  onChange={handleEducationChange}
  suggestions={educationSuggestions}
  maxItems={10}
  required={true}
/>
```

#### 1.2 Interfaz de Usuario

- **Lista de Registros**: Muestra todos los registros educativos añadidos
- **Botón "Añadir Educación"**: Permite agregar un nuevo registro
- **Formulario de Educación**: Aparece al añadir o editar un registro
- **Acciones por Registro**: Editar, Eliminar, Reordenar

#### 1.3 Formulario de Registro Educativo

```jsx
<EducationForm
  value={currentEducation}
  onChange={handleChange}
  onSave={handleSave}
  onCancel={handleCancel}
  suggestions={suggestions}
  errors={validationErrors}
/>
```

Campos incluidos:
- **Institución** (con autocompletado)
- **Título/Grado** (con autocompletado)
- **Campo de Estudio** (con autocompletado)
- **Fecha de Inicio** (selector de fecha)
- **Fecha de Finalización** (selector de fecha con opción "En curso")
- **Descripción** (textarea)

### Interacciones y Estados

#### 1.4 Añadir Nuevo Registro

1. Usuario hace clic en "Añadir Educación"
2. Se muestra el formulario de educación con campos vacíos
3. Usuario completa los campos y hace clic en "Guardar"
4. El nuevo registro se añade a la lista
5. El formulario se oculta o se limpia para un nuevo registro

#### 1.5 Editar Registro Existente

1. Usuario hace clic en "Editar" en un registro existente
2. El formulario se muestra con los datos del registro seleccionado
3. Usuario modifica los campos y hace clic en "Guardar"
4. El registro se actualiza en la lista
5. El formulario vuelve al estado inicial

#### 1.6 Eliminar Registro

1. Usuario hace clic en "Eliminar" en un registro existente
2. Se muestra un diálogo de confirmación
3. Si el usuario confirma, el registro se elimina de la lista

#### 1.7 Reordenar Registros

- Arrastrar y soltar para reordenar registros
- Botones para mover hacia arriba/abajo
- Ordenación automática por fecha (más reciente primero)

### Validación y Feedback

#### 1.8 Validación en Tiempo Real

- Validación mientras el usuario escribe
- Mensajes de error específicos por campo
- Indicadores visuales de campos válidos/inválidos

#### 1.9 Autocompletado Inteligente

- Sugerencias basadas en entradas previas del sistema
- Filtrado dinámico mientras el usuario escribe
- Posibilidad de seleccionar con teclado o ratón

### Implementación Técnica

#### 1.10 Estructura de Datos

```typescript
interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  isCurrentlyStudying?: boolean;
  description?: string;
}

type EducationList = Education[];
```

#### 1.11 Componentes React

```jsx
// Componente principal
const EducationField = ({ value, onChange, suggestions, maxItems, required }) => {
  // Lógica del componente
  return (
    <div className="education-field">
      <h3 className="field-title">Educación {required && <span className="required">*</span>}</h3>
      
      {/* Lista de registros */}
      <div className="education-list">
        {value.map((education, index) => (
          <EducationItem 
            key={education.id || index}
            education={education}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
          />
        ))}
      </div>
      
      {/* Formulario para añadir/editar */}
      {isFormVisible && (
        <EducationForm 
          value={currentEducation}
          onChange={handleFormChange}
          onSave={handleSave}
          onCancel={handleCancel}
          suggestions={suggestions}
          errors={validationErrors}
        />
      )}
      
      {/* Botón para añadir */}
      {!isFormVisible && value.length < maxItems && (
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={handleAdd}
        >
          <svg className="icon"><!-- Plus icon --></svg>
          Añadir Educación
        </button>
      )}
    </div>
  );
};
```

#### 1.12 Estilos CSS

```css
.education-field {
  margin-bottom: var(--space-lg);
}

.field-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
  color: var(--color-gray-900);
}

.education-list {
  margin-bottom: var(--space-md);
}

.education-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-md);
  background-color: var(--color-gray-100);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--space-sm);
}

.education-form {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.form-row {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.date-field {
  position: relative;
}

.currently-studying {
  margin-top: var(--space-xs);
}
```

## 2. Campo de Experiencia Laboral

El campo de experiencia laboral sigue un patrón similar al de educación, pero con campos específicos para información laboral.

### Diseño Visual

![Campo de Experiencia Laboral](https://via.placeholder.com/800x400/ffffff/333333?text=Campo+de+Experiencia+Laboral)

### Características Principales

#### 2.1 Estructura del Componente

```jsx
<WorkExperienceField
  value={workExperienceList}
  onChange={handleWorkExperienceChange}
  suggestions={workExperienceSuggestions}
  maxItems={15}
  required={true}
/>
```

#### 2.2 Interfaz de Usuario

- **Lista de Registros**: Muestra todas las experiencias laborales añadidas
- **Botón "Añadir Experiencia"**: Permite agregar un nuevo registro
- **Formulario de Experiencia**: Aparece al añadir o editar un registro
- **Acciones por Registro**: Editar, Eliminar, Reordenar

#### 2.3 Formulario de Registro de Experiencia

```jsx
<WorkExperienceForm
  value={currentExperience}
  onChange={handleChange}
  onSave={handleSave}
  onCancel={handleCancel}
  suggestions={suggestions}
  errors={validationErrors}
/>
```

Campos incluidos:
- **Empresa** (con autocompletado)
- **Puesto** (con autocompletado)
- **Ubicación** (con autocompletado)
- **Fecha de Inicio** (selector de fecha)
- **Fecha de Finalización** (selector de fecha con opción "Trabajo actual")
- **Descripción** (textarea)

### Características Específicas

#### 2.4 Opción "Trabajo Actual"

- Checkbox "Es mi trabajo actual"
- Al seleccionarlo, se deshabilita el campo de fecha de finalización
- Se muestra "Presente" en lugar de la fecha de finalización

#### 2.5 Cálculo Automático de Duración

- Muestra la duración del empleo (ej. "2 años, 3 meses")
- Se actualiza automáticamente al cambiar las fechas
- Para trabajos actuales, se calcula hasta la fecha actual

### Implementación Técnica

#### 2.6 Estructura de Datos

```typescript
interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate: Date | null;
  isCurrentJob?: boolean;
  description?: string;
}

type WorkExperienceList = WorkExperience[];
```

#### 2.7 Componentes React

```jsx
// Componente principal
const WorkExperienceField = ({ value, onChange, suggestions, maxItems, required }) => {
  // Lógica similar al componente de Educación
  return (
    <div className="work-experience-field">
      <h3 className="field-title">Experiencia Laboral {required && <span className="required">*</span>}</h3>
      
      {/* Lista de registros */}
      <div className="work-experience-list">
        {value.map((experience, index) => (
          <WorkExperienceItem 
            key={experience.id || index}
            experience={experience}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
          />
        ))}
      </div>
      
      {/* Formulario para añadir/editar */}
      {isFormVisible && (
        <WorkExperienceForm 
          value={currentExperience}
          onChange={handleFormChange}
          onSave={handleSave}
          onCancel={handleCancel}
          suggestions={suggestions}
          errors={validationErrors}
        />
      )}
      
      {/* Botón para añadir */}
      {!isFormVisible && value.length < maxItems && (
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={handleAdd}
        >
          <svg className="icon"><!-- Plus icon --></svg>
          Añadir Experiencia Laboral
        </button>
      )}
    </div>
  );
};
```

## 3. Campo de Carga de CV

El campo de carga de CV ha sido mejorado para proporcionar una experiencia más intuitiva y visual.

### Diseño Visual

![Campo de Carga de CV](https://via.placeholder.com/800x300/ffffff/333333?text=Campo+de+Carga+de+CV)

### Características Principales

#### 3.1 Estructura del Componente

```jsx
<FileUploadField
  value={file}
  onChange={handleFileChange}
  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  maxSize={5 * 1024 * 1024} // 5MB
  required={true}
  preview={true}
/>
```

#### 3.2 Interfaz de Usuario

- **Área de Arrastrar y Soltar**: Zona visual para arrastrar archivos
- **Botón de Selección**: Alternativa para seleccionar archivos del sistema
- **Previsualización**: Muestra información del archivo seleccionado
- **Indicador de Progreso**: Muestra el progreso durante la carga
- **Mensajes de Estado**: Informa sobre errores o éxito

### Interacciones y Estados

#### 3.3 Selección de Archivo

- Arrastrar y soltar archivo en el área designada
- Hacer clic en el botón para abrir el selector de archivos
- Validación inmediata de tipo y tamaño de archivo

#### 3.4 Previsualización

- Para PDFs: Miniatura de la primera página si es posible
- Para DOCXs: Icono de documento con nombre del archivo
- Información adicional: Tamaño, tipo, fecha de modificación

#### 3.5 Carga

- Indicador de progreso durante la carga
- Animación de "procesando" mientras se valida el archivo
- Mensaje de éxito cuando se completa la carga
- Opción para cancelar la carga en progreso

#### 3.6 Errores y Validación

- Validación de tipo de archivo (solo PDF y DOCX)
- Validación de tamaño máximo (5MB por defecto)
- Mensajes de error específicos y acciones sugeridas
- Opción para reintentar después de un error

### Implementación Técnica

#### 3.7 Estructura de Datos

```typescript
interface FileUploadState {
  file: File | null;
  preview: string | null;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}
```

#### 3.8 Componentes React

```jsx
// Componente principal
const FileUploadField = ({ value, onChange, accept, maxSize, required, preview }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState({
    progress: 0,
    status: 'idle',
    error: null
  });
  
  // Manejadores de eventos
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file) => {
    // Validar tipo de archivo
    if (!accept.split(',').some(type => {
      return file.type === type || 
             (type.startsWith('.') && file.name.endsWith(type));
    })) {
      setUploadState({
        ...uploadState,
        status: 'error',
        error: 'Tipo de archivo no permitido. Solo se aceptan PDF y DOCX.'
      });
      return;
    }
    
    // Validar tamaño
    if (file.size > maxSize) {
      setUploadState({
        ...uploadState,
        status: 'error',
        error: `El archivo excede el tamaño máximo permitido (${maxSize / 1024 / 1024}MB).`
      });
      return;
    }
    
    // Simular carga
    setUploadState({
      ...uploadState,
      status: 'uploading',
      progress: 0
    });
    
    // Simular progreso (en una implementación real, esto vendría del evento de carga)
    const interval = setInterval(() => {
      setUploadState(state => {
        if (state.progress >= 100) {
          clearInterval(interval);
          return {
            ...state,
            status: 'success',
            progress: 100
          };
        }
        return {
          ...state,
          progress: state.progress + 10
        };
      });
    }, 200);
    
    // Actualizar estado
    onChange(file);
  };
  
  const handleRemove = () => {
    onChange(null);
    setUploadState({
      progress: 0,
      status: 'idle',
      error: null
    });
  };
  
  return (
    <div className="file-upload-field">
      <label className="field-title">
        CV (PDF o DOCX) {required && <span className="required">*</span>}
      </label>
      
      {/* Área de arrastrar y soltar */}
      <div 
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${uploadState.status === 'error' ? 'has-error' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="cv-upload" 
          className="file-input" 
          accept={accept}
          onChange={handleChange}
        />
        
        {!value && uploadState.status === 'idle' && (
          <div className="file-upload-content">
            <svg className="icon icon-upload"><!-- Upload icon --></svg>
            <p>Arrastra y suelta un archivo aquí, o</p>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => document.getElementById('cv-upload').click()}
            >
              Seleccionar archivo
            </button>
            <p className="file-upload-help">
              Formatos permitidos: PDF, DOCX. Tamaño máximo: {maxSize / 1024 / 1024}MB.
            </p>
          </div>
        )}
        
        {uploadState.status === 'uploading' && (
          <div className="file-upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${uploadState.progress}%` }}
              ></div>
            </div>
            <p>Subiendo archivo... {uploadState.progress}%</p>
          </div>
        )}
        
        {uploadState.status === 'error' && (
          <div className="file-upload-error">
            <svg className="icon icon-error"><!-- Error icon --></svg>
            <p>{uploadState.error}</p>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => document.getElementById('cv-upload').click()}
            >
              Intentar de nuevo
            </button>
          </div>
        )}
        
        {value && uploadState.status === 'success' && (
          <div className="file-preview">
            {preview && (
              <div className="file-thumbnail">
                {value.type === 'application/pdf' ? (
                  <svg className="icon icon-pdf"><!-- PDF icon --></svg>
                ) : (
                  <svg className="icon icon-docx"><!-- DOCX icon --></svg>
                )}
              </div>
            )}
            <div className="file-info">
              <p className="file-name">{value.name}</p>
              <p className="file-meta">
                {(value.size / 1024).toFixed(1)} KB • {value.type.split('/')[1].toUpperCase()}
              </p>
            </div>
            <button 
              type="button" 
              className="btn-icon btn-remove"
              onClick={handleRemove}
            >
              <svg className="icon icon-remove"><!-- Remove icon --></svg>
            </button>
          </div>
        )}
      </div>
      
      {uploadState.status === 'error' && (
        <p className="form-error">{uploadState.error}</p>
      )}
    </div>
  );
};
```

#### 3.9 Estilos CSS

```css
.file-upload-field {
  margin-bottom: var(--space-lg);
}

.file-upload-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-gray-50);
  padding: var(--space-lg);
  transition: all var(--transition-fast);
}

.file-upload-area.drag-active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.file-upload-area.has-error {
  border-color: var(--color-error);
  background-color: rgba(239, 68, 68, 0.05);
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-upload {
  width: 48px;
  height: 48px;
  color: var(--color-gray-400);
  margin-bottom: var(--space-md);
}

.file-upload-help {
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.file-upload-progress {
  width: 100%;
  max-width: 300px;
}

.progress-bar {
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width var(--transition-normal);
}

.file-upload-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-error);
}

.icon-error {
  width: 32px;
  height: 32px;
  color: var(--color-error);
  margin-bottom: var(--space-sm);
}

.file-preview {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-md);
  padding: var(--space-sm);
}

.file-thumbnail {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-md);
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  margin-bottom: var(--space-xs);
}

.file-meta {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.btn-remove {
  color: var(--color-gray-400);
  transition: color var(--transition-fast);
}

.btn-remove:hover {
  color: var(--color-error);
}
```

## 4. Mejoras Generales para Todos los Campos

### 4.1 Accesibilidad

- Todos los campos tienen etiquetas asociadas correctamente
- Mensajes de error vinculados a los campos mediante `aria-describedby`
- Soporte completo para navegación por teclado
- Contrastes adecuados para todos los estados
- Textos alternativos para iconos funcionales

### 4.2 Internacionalización

- Todos los textos están preparados para traducción
- Formatos de fecha adaptables a diferentes locales
- Soporte para RTL (right-to-left) en diseños

### 4.3 Modo Oscuro

- Variables CSS alternativas para modo oscuro
- Contraste adecuado en ambos modos
- Transición suave entre modos

### 4.4 Rendimiento

- Carga diferida (lazy loading) para componentes complejos
- Optimización de re-renderizados con React.memo y useCallback
- Virtualización para listas largas de registros

## 5. Implementación y Próximos Pasos

### 5.1 Plan de Implementación

1. Desarrollar componentes base (inputs, selects, etc.)
2. Implementar componentes complejos (EducationField, WorkExperienceField, FileUploadField)
3. Integrar con el formulario principal de candidatos
4. Realizar pruebas de usabilidad
5. Iterar basado en feedback

### 5.2 Métricas de Éxito

- Reducción del tiempo para completar el formulario
- Disminución de errores de validación
- Aumento en la tasa de finalización del formulario
- Feedback positivo de los usuarios

### 5.3 Próximas Mejoras

- Guardado automático de borradores
- Importación de datos desde LinkedIn/CV
- Modo offline con sincronización posterior
- Análisis de datos para mejorar sugerencias de autocompletado 