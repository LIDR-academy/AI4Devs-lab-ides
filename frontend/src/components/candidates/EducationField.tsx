import React from 'react';
import { Education } from '../../types/Candidate';

interface EducationFieldProps {
  education: Education;
  index: number;
  onChange: (index: number, field: keyof Education, value: string | null) => void;
  onRemove: (index: number) => void;
  isRemovable: boolean;
  errors?: Record<string, string>;
}

/**
 * Componente para gestionar un campo de educación en el formulario de candidatos
 */
export const EducationField: React.FC<EducationFieldProps> = ({
  education,
  index,
  onChange,
  onRemove,
  isRemovable,
  errors = {}
}) => {
  const getFieldError = (fieldName: string) => {
    return errors[`education[${index}].${fieldName}`];
  };

  return (
    <div className="education-field p-4 mb-4 border rounded bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Educación #{index + 1}</h3>
        {isRemovable && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800"
            aria-label={`Eliminar educación ${index + 1}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Institución *
          </label>
          <input
            type="text"
            id={`institution-${index}`}
            value={education.institution}
            onChange={(e) => onChange(index, 'institution', e.target.value)}
            className={`w-full px-3 py-2 border ${getFieldError('institution') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            aria-required="true"
            aria-invalid={!!getFieldError('institution')}
            aria-describedby={getFieldError('institution') ? `institution-error-${index}` : undefined}
          />
          {getFieldError('institution') && (
            <p id={`institution-error-${index}`} className="mt-1 text-sm text-red-600">
              {getFieldError('institution')}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id={`degree-${index}`}
            value={education.degree}
            onChange={(e) => onChange(index, 'degree', e.target.value)}
            className={`w-full px-3 py-2 border ${getFieldError('degree') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            aria-required="true"
            aria-invalid={!!getFieldError('degree')}
            aria-describedby={getFieldError('degree') ? `degree-error-${index}` : undefined}
          />
          {getFieldError('degree') && (
            <p id={`degree-error-${index}`} className="mt-1 text-sm text-red-600">
              {getFieldError('degree')}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`fieldOfStudy-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Campo de estudio *
          </label>
          <input
            type="text"
            id={`fieldOfStudy-${index}`}
            value={education.fieldOfStudy}
            onChange={(e) => onChange(index, 'fieldOfStudy', e.target.value)}
            className={`w-full px-3 py-2 border ${getFieldError('fieldOfStudy') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            aria-required="true"
            aria-invalid={!!getFieldError('fieldOfStudy')}
            aria-describedby={getFieldError('fieldOfStudy') ? `fieldOfStudy-error-${index}` : undefined}
          />
          {getFieldError('fieldOfStudy') && (
            <p id={`fieldOfStudy-error-${index}`} className="mt-1 text-sm text-red-600">
              {getFieldError('fieldOfStudy')}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio *
          </label>
          <input
            type="date"
            id={`startDate-${index}`}
            value={education.startDate}
            onChange={(e) => onChange(index, 'startDate', e.target.value)}
            className={`w-full px-3 py-2 border ${getFieldError('startDate') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
            aria-required="true"
            aria-invalid={!!getFieldError('startDate')}
            aria-describedby={getFieldError('startDate') ? `startDate-error-${index}` : undefined}
          />
          {getFieldError('startDate') && (
            <p id={`startDate-error-${index}`} className="mt-1 text-sm text-red-600">
              {getFieldError('startDate')}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de finalización
          </label>
          <input
            type="date"
            id={`endDate-${index}`}
            value={education.endDate || ''}
            onChange={(e) => onChange(index, 'endDate', e.target.value || null)}
            className={`w-full px-3 py-2 border ${getFieldError('endDate') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-invalid={!!getFieldError('endDate')}
            aria-describedby={getFieldError('endDate') ? `endDate-error-${index}` : undefined}
          />
          {getFieldError('endDate') && (
            <p id={`endDate-error-${index}`} className="mt-1 text-sm text-red-600">
              {getFieldError('endDate')}
            </p>
          )}
          <div className="mt-1">
            <label className="inline-flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={!education.endDate}
                onChange={(e) => onChange(index, 'endDate', e.target.checked ? null : '')}
                className="mr-2"
              />
              Actualmente estudiando aquí
            </label>
          </div>
        </div>

        <div className="form-group md:col-span-2">
          <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id={`description-${index}`}
            value={education.description || ''}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}; 