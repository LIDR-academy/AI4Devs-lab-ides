import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Icon from '../common/Icon';

// Interfaces
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  currentJob: boolean;
  description: string;
}

export interface WorkExperienceFieldProps {
  value: WorkExperience[];
  onChange: (value: WorkExperience[]) => void;
  maxItems?: number;
  required?: boolean;
  suggestions?: {
    companies?: string[];
    positions?: string[];
    locations?: string[];
  };
}

interface WorkExperienceFormProps {
  value: WorkExperience;
  onChange: (value: WorkExperience) => void;
  onSave: () => void;
  onCancel: () => void;
  suggestions?: {
    companies?: string[];
    positions?: string[];
    locations?: string[];
  };
}

// Componente principal
const WorkExperienceField: React.FC<WorkExperienceFieldProps> = ({
  value = [],
  onChange,
  maxItems = 10,
  required = false,
  suggestions = {},
}) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(value);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    id: '',
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    currentJob: false,
    description: '',
  });

  // Actualizar el estado local cuando cambian las props
  React.useEffect(() => {
    setExperiences(value);
  }, [value]);

  // Generar un ID único
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // Agregar nueva experiencia
  const handleAddExperience = () => {
    setNewExperience({
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      currentJob: false,
      description: '',
    });
    setIsAdding(true);
    setIsEditing(null);
  };

  // Editar experiencia existente
  const handleEditExperience = (id: string) => {
    const experienceToEdit = experiences.find(exp => exp.id === id);
    if (experienceToEdit) {
      setNewExperience({ ...experienceToEdit });
      setIsEditing(id);
      setIsAdding(false);
    }
  };

  // Eliminar experiencia
  const handleDeleteExperience = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta experiencia laboral?')) {
      onChange(experiences.filter(exp => exp.id !== id));
    }
  };

  // Manejar cambios en el formulario
  const handleExperienceChange = (updatedExperience: WorkExperience) => {
    setNewExperience(updatedExperience);
  };

  // Validar experiencia
  const validateExperience = (experience: WorkExperience): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Validar empresa
    if (!experience.company.trim()) {
      newErrors.company = 'La empresa es obligatoria';
    }
    
    // Validar cargo
    if (!experience.position.trim()) {
      newErrors.position = 'El cargo es obligatorio';
    }
    
    // Validar fecha de inicio
    if (!experience.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }
    
    // Validar fecha de fin (solo si no es trabajo actual)
    if (!experience.currentJob && !experience.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria';
    }
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (experience.startDate && experience.endDate && new Date(experience.startDate) > new Date(experience.endDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    return newErrors;
  };

  // Guardar experiencia
  const handleSaveExperience = () => {
    const validationErrors = validateExperience(newExperience);
    
    if (Object.keys(validationErrors).length === 0) {
      if (isEditing) {
        // Actualizar experiencia existente
        const updatedExperiences = experiences.map(exp => 
          exp.id === isEditing ? newExperience : exp
        );
        onChange(updatedExperiences);
        setIsEditing(null);
      } else {
        // Agregar nueva experiencia
        onChange([...experiences, newExperience]);
        setIsAdding(false);
      }
      
      // Limpiar estado
      setNewExperience({
        id: '',
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        currentJob: false,
        description: '',
      });
      
      // Limpiar errores
      const newErrors = { ...errors };
      delete newErrors[newExperience.id];
      setErrors(newErrors);
    } else {
      // Actualizar errores
      setErrors({
        ...errors,
        [newExperience.id]: validationErrors,
      });
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsAdding(false);
    setIsEditing(null);
    
    // Limpiar errores
    const newErrors = { ...errors };
    delete newErrors[newExperience.id];
    setErrors(newErrors);
  };

  // Manejar reordenamiento
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(experiences);
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
  const calculateDuration = (startDate: string, endDate: string, currentJob: boolean): string => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = currentJob ? new Date() : new Date(endDate);
    
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4" id="work-experience-section-title">
        Experiencia Laboral {required && <span className="text-error-500">*</span>}
      </h3>
      <p className="text-sm text-gray-600 mb-4" id="work-experience-section-description">
        Añade tu experiencia laboral, comenzando por el trabajo más reciente.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="work-experience-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mb-4"
            >
              {experiences.length > 0 && (
                <>
                  {experiences.map((experience, index) => (
                    <Draggable
                      key={experience.id}
                      draggableId={experience.id}
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
                              {experience.position}
                            </h4>
                            <p className="text-md text-gray-700 mb-1">
                              {experience.company}
                              {experience.location && `, ${experience.location}`}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {formatDate(experience.startDate)} - {experience.currentJob
                                ? 'Presente'
                                : formatDate(experience.endDate)}
                              {(experience.currentJob || experience.endDate) && experience.startDate && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ({calculateDuration(experience.startDate, experience.endDate, experience.currentJob)})
                                </span>
                              )}
                            </p>
                            {experience.description && (
                              <p className="text-sm text-gray-700 mt-1 leading-normal">
                                {experience.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditExperience(experience.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                              aria-label="Editar experiencia"
                            >
                              <Icon name="edit" size="sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(experience.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                              aria-label="Eliminar experiencia"
                            >
                              <Icon name="delete" size="sm" />
                            </button>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...experiences];
                                  [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
                                  onChange(newItems);
                                }}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal"
                                aria-label="Mover hacia arriba"
                              >
                                <Icon name="chevron-up" size="sm" />
                              </button>
                            )}
                            {index < experiences.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = [...experiences];
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

      {!isAdding && !isEditing && experiences.length < maxItems && (
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-normal"
        >
          <Icon name="add" size="sm" className="mr-2" />
          Añadir experiencia laboral
        </button>
      )}

      {(isAdding || isEditing) && (
        <WorkExperienceForm
          value={newExperience}
          onChange={handleExperienceChange}
          onSave={handleSaveExperience}
          onCancel={handleCancelEdit}
          suggestions={suggestions}
        />
      )}
    </div>
  );
};

// Componente de formulario para experiencia laboral
const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  suggestions = {},
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const companyRef = useRef<HTMLInputElement>(null);
  
  // Enfocar el primer campo al montar el componente
  React.useEffect(() => {
    if (companyRef.current) {
      companyRef.current.focus();
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
    
    // Si es trabajo actual, limpiar la fecha de fin
    const updates: Partial<WorkExperience> = { [name]: checked };
    if (name === 'currentJob' && checked) {
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
  
  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar empresa
    if (!value.company.trim()) {
      newErrors.company = 'La empresa es obligatoria';
    }
    
    // Validar cargo
    if (!value.position.trim()) {
      newErrors.position = 'El cargo es obligatorio';
    }
    
    // Validar fecha de inicio
    if (!value.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }
    
    // Validar fecha de fin (solo si no es trabajo actual)
    if (!value.currentJob && !value.endDate) {
      newErrors.endDate = 'La fecha de fin es obligatoria';
    }
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (value.startDate && value.endDate && new Date(value.startDate) > new Date(value.endDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Guardar experiencia
  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm" role="form" aria-labelledby="work-experience-form-title">
      <h4 id="work-experience-form-title" className="sr-only">Formulario de Experiencia Laboral</h4>
      <div className="flex flex-col md:flex-row md:gap-4 mb-4">
        <div className="flex-1 mb-4 md:mb-0">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Empresa <span className="text-error-500">*</span>
          </label>
          <input
            ref={companyRef}
            type="text"
            id="company"
            name="company"
            value={value.company}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.company ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal`}
            placeholder="Ej. Google Inc."
            list="company-suggestions"
          />
          {suggestions.companies && suggestions.companies.length > 0 && (
            <datalist id="company-suggestions">
              {suggestions.companies.map((company, index) => (
                <option key={index} value={company} />
              ))}
            </datalist>
          )}
          {errors.company && (
            <p id="company-error" className="text-sm text-error-500 mt-1">{errors.company}</p>
          )}
        </div>

        <div className="flex-1 mb-4 md:mb-0">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Cargo <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={value.position}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!errors.position}
            aria-describedby={errors.position ? "position-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.position ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal`}
            placeholder="Ej. Desarrollador Frontend"
            list="position-suggestions"
          />
          {suggestions.positions && suggestions.positions.length > 0 && (
            <datalist id="position-suggestions">
              {suggestions.positions.map((position, index) => (
                <option key={index} value={position} />
              ))}
            </datalist>
          )}
          {errors.position && (
            <p id="position-error" className="text-sm text-error-500 mt-1">{errors.position}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Ubicación
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={value.location}
          onChange={handleChange}
          className="w-full px-3 py-2 text-md text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-primary-300 transition-all duration-normal"
          placeholder="Ej. Madrid, España"
          list="location-suggestions"
        />
        {suggestions.locations && suggestions.locations.length > 0 && (
          <datalist id="location-suggestions">
            {suggestions.locations.map((location, index) => (
              <option key={index} value={location} />
            ))}
          </datalist>
        )}
        <p id="location-hint" className="text-xs text-gray-500 mt-1">
          Opcional. Ciudad, país o remoto.
        </p>
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
            Fecha de Finalización {!value.currentJob && <span className="text-error-500">*</span>}
          </label>
          <input
            type="month"
            id="endDate"
            name="endDate"
            value={value.endDate}
            onChange={handleChange}
            required={!value.currentJob}
            disabled={value.currentJob}
            aria-required={!value.currentJob}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? "endDate-error" : undefined}
            className={`w-full px-3 py-2 text-md text-gray-900 bg-white border ${errors.endDate ? 'border-error-500 focus:ring-error-300' : 'border-gray-300 focus:ring-primary-300'} rounded-md focus:outline-none focus:ring-3 transition-all duration-normal ${value.currentJob ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.endDate && (
            <p id="endDate-error" className="text-sm text-error-500 mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex items-center mt-1 mb-4">
        <input
          type="checkbox"
          id="currentJob"
          name="currentJob"
          checked={value.currentJob}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 transition-all duration-normal"
        />
        <label htmlFor="currentJob" className="ml-2 text-sm text-gray-700">
          Actualmente trabajo aquí
        </label>
        <p id="current-job-hint" className="sr-only">
          Marca esta casilla si actualmente trabajas en esta empresa
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
          placeholder="Describe brevemente tus responsabilidades, logros, etc."
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

export default WorkExperienceField; 