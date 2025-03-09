import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

// Tipo para los datos de educación
export type EducationItem = {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
};

// Props para el componente
interface EducationFormSectionProps {
  control: Control<any>;
  register: any;
  errors: any;
}

const EducationFormSection: React.FC<EducationFormSectionProps> = ({
  control,
  register,
  errors
}) => {
  // Usar useFieldArray para manejar un array de campos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  });

  // Añadir un nuevo registro de educación vacío
  const addEducation = () => {
    append({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Educación</h3>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
        >
          <FiPlus className="mr-1" />
          Añadir educación
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">No hay registros de educación. Añade uno usando el botón de arriba.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Educación #{index + 1}</h4>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Institución */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Institución *
              </label>
              <input
                type="text"
                {...register(`education.${index}.institution`, { required: "La institución es obligatoria" })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                  errors.education?.[index]?.institution ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Universidad de Barcelona"
              />
              {errors.education?.[index]?.institution && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index].institution.message}</p>
              )}
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Título *
              </label>
              <input
                type="text"
                {...register(`education.${index}.degree`, { required: "El título es obligatorio" })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                  errors.education?.[index]?.degree ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Grado en Ingeniería Informática"
              />
              {errors.education?.[index]?.degree && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index].degree.message}</p>
              )}
            </div>

            {/* Campo de estudio */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Campo de estudio
              </label>
              <input
                type="text"
                {...register(`education.${index}.field`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2"
                placeholder="Ej: Ciencias de la Computación"
              />
            </div>

            {/* Fecha de inicio */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Fecha de inicio *
              </label>
              <input
                type="date"
                {...register(`education.${index}.startDate`, { required: "La fecha de inicio es obligatoria" })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2 ${
                  errors.education?.[index]?.startDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.education?.[index]?.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.education[index].startDate.message}</p>
              )}
            </div>

            {/* Fecha de fin */}
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Fecha de fin
              </label>
              <input
                type="date"
                {...register(`education.${index}.endDate`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-700">
              Descripción
            </label>
            <textarea
              {...register(`education.${index}.description`)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-steel-blue-500 focus:border-steel-blue-500 sm:text-sm px-3 py-2"
              placeholder="Descripción adicional sobre esta educación..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationFormSection; 