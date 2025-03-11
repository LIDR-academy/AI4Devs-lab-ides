import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

// Tipo para los datos de experiencia laboral
export type WorkExperienceItem = {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
};

// Props para el componente
interface WorkExperienceFormSectionProps {
  control: Control<any>;
  register: any;
  errors: any;
}

const WorkExperienceFormSection: React.FC<WorkExperienceFormSectionProps> = ({
  control,
  register,
  errors
}) => {
  // Usar useFieldArray para manejar un array de campos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience"
  });

  // Añadir un nuevo registro de experiencia laboral vacío
  const addWorkExperience = () => {
    append({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Experiencia Laboral</h3>
        <button
          type="button"
          onClick={addWorkExperience}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
        >
          <FiPlus className="mr-1" />
          Añadir experiencia
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">No hay registros de experiencia laboral. Añade uno usando el botón de arriba.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Experiencia #{index + 1}</h4>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Empresa */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Empresa *
              </label>
              <input
                type="text"
                {...register(`workExperience.${index}.company`, { required: "La empresa es obligatoria" })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                  errors.workExperience?.[index]?.company ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Acme Inc."
              />
              {errors.workExperience?.[index]?.company && (
                <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].company.message}</p>
              )}
            </div>

            {/* Posición */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Posición *
              </label>
              <input
                type="text"
                {...register(`workExperience.${index}.position`, { required: "La posición es obligatoria" })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                  errors.workExperience?.[index]?.position ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Desarrollador Frontend"
              />
              {errors.workExperience?.[index]?.position && (
                <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].position.message}</p>
              )}
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Fecha de inicio *
              </label>
              <input
                type="date"
                {...register(`workExperience.${index}.startDate`, { required: "La fecha de inicio es obligatoria" })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                  errors.workExperience?.[index]?.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.workExperience?.[index]?.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.workExperience[index].startDate.message}</p>
              )}
            </div>

            {/* Fecha de fin */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Fecha de fin
              </label>
              <input
                type="date"
                {...register(`workExperience.${index}.endDate`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2"
              />
              <p className="mt-1 text-xs text-gray-500">Dejar en blanco si es el trabajo actual</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700">
              Descripción
            </label>
            <textarea
              {...register(`workExperience.${index}.description`)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2"
              placeholder="Describe tus responsabilidades y logros en este puesto..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkExperienceFormSection; 