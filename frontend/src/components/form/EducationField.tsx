import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Icon from '../common/Icon';

// Interfaces
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrentlyStudying: boolean;
  description: string;
}

export interface EducationFieldProps {
  value: Education[];
  onChange: (value: Education[]) => void;
  maxItems?: number;
  required?: boolean;
  suggestions?: {
    institutions?: string[];
    degrees?: string[];
    fieldsOfStudy?: string[];
  };
}

interface EducationFormProps {
  value: Education;
  onChange: (value: Education) => void;
  onSave: () => void;
  onCancel: () => void;
  suggestions?: {
    institutions?: string[];
    degrees?: string[];
    fieldsOfStudy?: string[];
  };
}

/**
 * Componente EducationField
 * Permite al usuario gestionar múltiples registros educativos
 */
const EducationField: React.FC<EducationFieldProps> = ({
  value = [],
  onChange,
  maxItems = 10,
  required = false,
  suggestions = {},
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    id: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    description: '',
  });

  // Generar un ID único
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Agregar nueva educación
  const handleAddEducation = () => {
    setNewEducation({
      id: generateId(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      description: '',
    });
    setIsAdding(true);
  };

  // Editar educación existente
  const handleEditEducation = (id: string) => {
    const educationToEdit = value.find(edu => edu.id === id);
    if (educationToEdit) {
      setNewEducation({ ...educationToEdit });
      setIsEditing(id);
    }
  };

  // Eliminar educación
  const handleDeleteEducation = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta educación?')) {
      onChange(value.filter(edu => edu.id !== id));
    }
  };

  // Guardar educación (nueva o editada)
  const handleSaveEducation = () => {
    if (isEditing) {
      // Actualizar educación existente
      onChange(value.map(edu => edu.id === isEditing ? newEducation : edu));
      setIsEditing(null);
    } else {
      // Agregar nueva educación
      onChange([...value, newEducation]);
      setIsAdding(false);
    }
  };

  // Cancelar adición o edición
  const handleCancelEducation = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  // Manejar cambios en el formulario
  const handleEducationChange = (updatedEducation: Education) => {
    setNewEducation(updatedEducation);
  };

  // Manejar reordenamiento
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onChange(items);
  };

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.toLocaleString('es', { month: 'long' });
    const year = date.getFullYear();
    
    return `${month} ${year}`;
  };

  // Calcular duración
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let duration = '';
    
    if (years > 0) {
      duration += `${years} año${years !== 1 ? 's' : ''}`;
    }
    
    if (months > 0 || (months === 0 && years === 0)) {
      if (duration) duration += ' y ';
      duration += `${months} mes${months !== 1 ? 'es' : ''}`;
    }
    
    return duration;
  };

  return (
    <div className="mb-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-4" id="education-section-title">
        Educación {required && <span className="text-error-500">*</span>}
      </h3>
      <p className="text-sm text-gray-600 mb-4" id="education-section-description">
        Añade tu historial educativo, comenzando por la educación más reciente.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mb-4"
            >
              {value.length > 0 && (
                <>
                  {value.map((education, index) => (
                    <Draggable
                      key={education.id}
                      draggableId={education.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex justify-between items-start p-4 bg-gray-50 border border-gray-200 rounded-lg mb-2 transition-all duration-normal hover:shadow-md hover:border-gray-300"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move mr-2"
                            aria-label="Arrastrar para reordenar"
                          >
                            <Icon name="sort" size="md" color="gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-md font-semibold text-gray-900 mb-1">
                              {education.institution}
                            </h4>
                            <p className="text-md text-gray-700 mb-1">
                              {education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ''}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {formatDate(education.startDate)} - {education.isCurrentlyStudying
                                ? 'Presente'
                                : formatDate(education.endDate)}
                              {!education.isCurrentlyStudying && education.startDate && education.endDate && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ({calculateDuration(education.startDate, education.endDate)})
                                </span>
                              )}
                            </p>
                            {education.description && (
                              <p className="text-sm text-gray-700 mt-1 leading-normal">
                                {education.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditEducation(education.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                              aria-label="Editar educación"
                            >
                              <Icon name="edit" size="sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEducation(education.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                              aria-label="Eliminar educación"
                            >
                              <Icon name="delete" size="sm" />
                            </button>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...value];
                                  [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
                                  onChange(newItems);
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                                aria-label="Mover hacia arriba"
                              >
                                <Icon name="chevron-up" size="sm" />
                              </button>
                            )}
                            {index < value.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...value];
                                  [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                                  onChange(newItems);
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                                aria-label="Mover hacia abajo"
                              >
                                <Icon name="chevron-down" size="sm" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {!isAdding && !isEditing && value.length < maxItems && (
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-green border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-normal"
        >
          <Icon name="add" size="sm" className="mr-2" />
          Añadir educación
        </button>
      )}

      {(isAdding || isEditing) && (
        <EducationForm
          value={newEducation}
          onChange={handleEducationChange}
          onSave={handleSaveEducation}
          onCancel={handleCancelEducation}
          suggestions={suggestions}
        />
      )}
    </div>
  );
};

// Componente de formulario para educación
const EducationForm: React.FC<EducationFormProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  suggestions = {},
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const institutionRef = useRef<HTMLInputElement>(null);
  
  // Enfocar el primer campo al montar el componente
  React.useEffect(() => {
    if (institutionRef.current) {
      institutionRef.current.focus();
    }
  }, []);
  
  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value: fieldValue } = e.target;
    
    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    onChange({
      ...value,
      [name]: fieldValue,
    });
  };
  
  // Manejar cambios en checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Si está estudiando actualmente, limpiar la fecha de fin
    const updates: Partial<Education> = { [name]: checked };
    if (name === 'isCurrentlyStudying' && checked) {
      updates.endDate = '';
      
      // Limpiar error de fecha de fin si existe
      if (errors.endDate) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.endDate;
          return newErrors;
        });
      }
    }
    
    onChange({
      ...value,
      ...updates,
    });
  };
  
  // Validar un campo específico
  const validateField = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value: fieldValue } = e.target;
    const newErrors = { ...errors };
    
    switch (name) {
      case 'institution':
        if (!fieldValue.trim()) {
          newErrors.institution = 'La institución es obligatoria';
        } else {
          delete newErrors.institution;
        }
        break;
      case 'degree':
        if (!fieldValue.trim()) {
          newErrors.degree = 'El título o grado es obligatorio';
        } else {
          delete newErrors.degree;
        }
        break;
      case 'fieldOfStudy':
        if (!fieldValue.trim()) {
          newErrors.fieldOfStudy = 'El campo de estudio es obligatorio';
        } else {
          delete newErrors.fieldOfStudy;
        }
        break;
      case 'startDate':
        if (!fieldValue) {
          newErrors.startDate = 'La fecha de inicio es obligatoria';
        } else {
          delete newErrors.startDate;
        }
        break;
      case 'endDate':
        if (!value.isCurrentlyStudying && !fieldValue) {
          newErrors.endDate = 'La fecha de fin es obligatoria';
        } else if (fieldValue && value.startDate && new Date(value.startDate) > new Date(fieldValue)) {
          newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
        } else {
          delete newErrors.endDate;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };
  
  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar institución
    if (!value.institution.trim()) {
      newErrors.institution = 'La institución es obligatoria';
    }
    
    // Validar grado/título
    if (!value.degree.trim()) {
      newErrors.degree = 'El título o grado es obligatorio';
    }
    
    // Validar campo de estudio
    if (!value.fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = 'El campo de estudio es obligatorio';
    }
    
    // Validar fecha de inicio
    if (!value.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }
    
    // Validar fecha de fin (solo si no está estudiando actualmente)
    if (!value.isCurrentlyStudying && !value.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria';
    }
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (value.startDate && value.endDate && new Date(value.startDate) > new Date(value.endDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Guardar educación
  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm" role="form" aria-labelledby="education-form-title">
      <h4 id="education-form-title" className="sr-only">Formulario de Educación</h4>
      <div className="flex flex-col md:flex-row md:gap-4 mb-4">
        <div className="flex-1 mb-4 md:mb-0">
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
            Institución <span className="text-error-500">*</span>
          </label>
          <input
            ref={institutionRef}
            type="text"
            id="institution"
            name="institution"
            value={value.institution}
            onChange={handleChange}
            onBlur={validateField}
            required
            aria-required="true"
            aria-invalid={!!errors.institution}
            aria-describedby={errors.institution ? "institution-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.institution ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal`}
            placeholder="Ej. Universidad de Barcelona"
            list="institution-suggestions"
          />
          {suggestions.institutions && suggestions.institutions.length > 0 && (
            <datalist id="institution-suggestions">
              {suggestions.institutions.map((institution, index) => (
                <option key={index} value={institution} />
              ))}
            </datalist>
          )}
          {errors.institution && (
            <p id="institution-error" className="text-sm text-error-500 mt-1">{errors.institution}</p>
          )}
        </div>

        <div className="flex-1 mb-4 md:mb-0">
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
            Título/Grado <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={value.degree}
            onChange={handleChange}
            onBlur={validateField}
            required
            aria-required="true"
            aria-invalid={!!errors.degree}
            aria-describedby={errors.degree ? "degree-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.degree ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal`}
            placeholder="Ej. Licenciatura en Informática"
            list="degree-suggestions"
          />
          {suggestions.degrees && suggestions.degrees.length > 0 && (
            <datalist id="degree-suggestions">
              {suggestions.degrees.map((degree, index) => (
                <option key={index} value={degree} />
              ))}
            </datalist>
          )}
          {errors.degree && (
            <p id="degree-error" className="text-sm text-error-500 mt-1">{errors.degree}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
          Campo de Estudio <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          id="fieldOfStudy"
          name="fieldOfStudy"
          value={value.fieldOfStudy}
          onChange={handleChange}
          onBlur={validateField}
          required
          aria-required="true"
          aria-invalid={!!errors.fieldOfStudy}
          aria-describedby={errors.fieldOfStudy ? "fieldOfStudy-error" : undefined}
          className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.fieldOfStudy ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal`}
          placeholder="Ej. Ciencias de la Computación"
          list="fieldOfStudy-suggestions"
        />
        {suggestions.fieldsOfStudy && suggestions.fieldsOfStudy.length > 0 && (
          <datalist id="fieldOfStudy-suggestions">
            {suggestions.fieldsOfStudy.map((field, index) => (
              <option key={index} value={field} />
            ))}
          </datalist>
        )}
        {errors.fieldOfStudy && (
          <p id="fieldOfStudy-error" className="text-sm text-error-500 mt-1">{errors.fieldOfStudy}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:gap-4 mb-4">
        <div className="flex-1 mb-4 md:mb-0 relative">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio <span className="text-error-500">*</span>
          </label>
          <input
            type="month"
            id="startDate"
            name="startDate"
            value={value.startDate}
            onChange={handleChange}
            onBlur={validateField}
            required
            aria-required="true"
            aria-invalid={!!errors.startDate}
            aria-describedby={errors.startDate ? "startDate-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.startDate ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal`}
          />
          {errors.startDate && (
            <p id="startDate-error" className="text-sm text-error-500 mt-1">{errors.startDate}</p>
          )}
        </div>

        <div className="flex-1 mb-4 md:mb-0 relative">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Finalización {!value.isCurrentlyStudying && <span className="text-error-500">*</span>}
          </label>
          <input
            type="month"
            id="endDate"
            name="endDate"
            value={value.endDate}
            onChange={handleChange}
            onBlur={validateField}
            required={!value.isCurrentlyStudying}
            disabled={value.isCurrentlyStudying}
            aria-required={!value.isCurrentlyStudying}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? "endDate-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.endDate ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal ${value.isCurrentlyStudying ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.endDate && (
            <p id="endDate-error" className="text-sm text-error-500 mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex items-center mt-1 mb-4">
        <input
          type="checkbox"
          id="isCurrentlyStudying"
          name="isCurrentlyStudying"
          checked={value.isCurrentlyStudying}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition-all duration-normal"
        />
        <label htmlFor="isCurrentlyStudying" className="ml-2 text-sm text-gray-700">
          Actualmente estoy estudiando aquí
        </label>
        <p id="currently-studying-hint" className="sr-only">
          Marca esta casilla si actualmente estás estudiando en esta institución
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={value.description}
          onChange={handleChange}
          aria-describedby="description-hint"
          className="w-full px-3 py-2 text-md text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-primary-300 min-h-[100px] resize-y transition-all duration-normal"
          placeholder="Describe brevemente tu experiencia educativa, logros, etc."
        />
        <p id="description-hint" className="text-xs text-gray-500 mt-1">
          Opcional. Máximo 500 caracteres.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-normal"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-normal"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EducationField; 