# Diseño de Componentes Frontend - Sistema ATS

## Estructura de Componentes

### 1. Layout Components
```
└── AppLayout/
    ├── Header/
    │   └── Navigation
    ├── Main/
    └── Footer/
```

### 2. Feature Components
```
└── Candidates/
    ├── AddCandidateButton/
    ├── CandidateForm/
    │   ├── PersonalInfoSection/
    │   ├── EducationSection/
    │   │   └── EducationFormItem/
    │   ├── WorkExperienceSection/
    │   │   └── WorkExperienceFormItem/
    │   └── DocumentUploadSection/
    └── shared/
        ├── DatePicker/
        ├── FileUploader/
        └── ValidationMessages/
```

## Descripción de Componentes

### AppLayout
- **Propósito**: Estructura base de la aplicación
- **Estado**: No
- **Props**: children
- **Responsabilidades**: Layout general, enrutamiento

### Header
- **Propósito**: Barra superior de navegación
- **Estado**: No
- **Props**: No
- **Responsabilidades**: Mostrar navegación y branding

### CandidateForm
- **Propósito**: Formulario principal para añadir candidato
- **Estado**: 
  ```typescript
  interface CandidateFormState {
    currentStep: number;
    formData: {
      personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
      };
      education: Education[];
      workExperience: WorkExperience[];
      document: File | null;
    };
    errors: Record<string, string>;
    isSubmitting: boolean;
  }
  ```
- **Validaciones**:
  - Campos requeridos
  - Formato de email
  - Formato de teléfono
  - Fechas válidas
  - Al menos una entrada de educación y experiencia
- **Responsabilidades**:
  - Gestión del estado del formulario
  - Validación de datos
  - Envío de datos al backend
  - Manejo de errores
  - Navegación entre secciones

### PersonalInfoSection
- **Propósito**: Sección de información personal
- **Estado**: No
- **Props**: 
  ```typescript
  interface PersonalInfoProps {
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
    };
    errors: Record<string, string>;
    onChange: (field: string, value: string) => void;
  }
  ```
- **Validaciones**:
  - Campos requeridos en tiempo real
  - Formato de email en tiempo real
  - Formato de teléfono en tiempo real

### EducationSection
- **Propósito**: Gestión de entradas de educación
- **Estado**: No
- **Props**:
  ```typescript
  interface EducationSectionProps {
    educationList: Education[];
    errors: Record<string, string>;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, data: Education) => void;
  }
  ```
- **Validaciones**:
  - Al menos una entrada
  - Fechas válidas (inicio <= fin)
  - Campos requeridos

### WorkExperienceSection
- **Propósito**: Gestión de entradas de experiencia laboral
- **Estado**: No
- **Props**:
  ```typescript
  interface WorkExperienceSectionProps {
    experienceList: WorkExperience[];
    errors: Record<string, string>;
    onAdd: () => void;
    onRemove: (index: number) => void;
    onChange: (index: number, data: WorkExperience) => void;
  }
  ```
- **Validaciones**:
  - Al menos una entrada
  - Fechas válidas (inicio <= fin)
  - Campos requeridos

### DocumentUploadSection
- **Propósito**: Gestión de carga de CV
- **Estado**: 
  ```typescript
  interface DocumentUploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
  }
  ```
- **Props**:
  ```typescript
  interface DocumentUploadProps {
    onFileSelect: (file: File) => void;
    error: string | null;
  }
  ```
- **Validaciones**:
  - Tipo de archivo (PDF/DOCX)
  - Tamaño máximo (5MB)
  - Archivo requerido

### Componentes Compartidos

#### DatePicker
- **Propósito**: Selector de fechas personalizado
- **Props**:
  ```typescript
  interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    error?: string;
    minDate?: string;
    maxDate?: string;
  }
  ```

#### FileUploader
- **Propósito**: Componente de carga de archivos
- **Props**:
  ```typescript
  interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    acceptedTypes: string[];
    maxSize: number;
    error?: string;
  }
  ```

#### ValidationMessages
- **Propósito**: Mostrar mensajes de error/éxito
- **Props**:
  ```typescript
  interface ValidationMessagesProps {
    message: string;
    type: 'error' | 'success' | 'warning';
  }
  ```

## Gestión de Estado

### Estado Global (React Context)
```typescript
interface GlobalState {
  isSubmitting: boolean;
  currentStep: number;
  formData: CandidateFormData;
  errors: Record<string, string>;
}

interface GlobalActions {
  setFormData: (data: Partial<CandidateFormData>) => void;
  setCurrentStep: (step: number) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}
```

## Validaciones del Cliente

### Reglas de Validación
1. **Información Personal**
   - Nombre y apellidos: requeridos, solo letras y espacios
   - Email: requerido, formato válido
   - Teléfono: requerido, formato internacional
   - Dirección: requerida

2. **Educación**
   - Al menos una entrada
   - Título e institución requeridos
   - Fechas válidas y en orden correcto
   - Descripción opcional

3. **Experiencia Laboral**
   - Al menos una entrada
   - Empresa y cargo requeridos
   - Fechas válidas y en orden correcto
   - Responsabilidades opcional

4. **Documento**
   - Archivo requerido
   - Solo PDF o DOCX
   - Tamaño máximo 5MB

### Manejo de Errores
- Validación en tiempo real para campos críticos
- Validación al cambiar de sección
- Validación completa antes de envío
- Mensajes de error claros y específicos
- Indicadores visuales de error

## Flujo de Usuario
1. Click en "Añadir Candidato"
2. Completar información personal
3. Añadir entradas de educación
4. Añadir entradas de experiencia laboral
5. Subir documento CV
6. Revisar y enviar
7. Mostrar confirmación o errores 