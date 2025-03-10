import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { candidatoSchema } from '../../utils/validations';
import { candidatoService } from '../../services/api';
import { Candidato, CandidatoFormData } from '../../types/candidato';

interface FormularioCandidatoProps {
  candidatoId?: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

type Option = {
  value: string;
  label: string;
};

const FormularioCandidato: React.FC<FormularioCandidatoProps> = ({
  candidatoId,
  onSubmitSuccess,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Para autocompletado
  const [educacionOptions, setEducacionOptions] = useState<Option[]>([]);
  const [experienciaOptions, setExperienciaOptions] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset
  } = useForm<CandidatoFormData>({
    resolver: zodResolver(candidatoSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      educacion: '',
      experiencia_laboral: '',
      cv: undefined
    }
  });

  // Cargar datos del candidato en caso de edición
  useEffect(() => {
    const fetchCandidato = async () => {
      if (candidatoId) {
        try {
          const response = await candidatoService.getCandidatoById(candidatoId);
          
          if (response.data) {
            const candidato = response.data;
            // Rellenar el formulario con los datos del candidato
            setValue('nombre', candidato.nombre);
            setValue('apellido', candidato.apellido);
            setValue('email', candidato.email);
            setValue('telefono', candidato.telefono);
            setValue('direccion', candidato.direccion || '');
            setValue('educacion', candidato.educacion || '');
            setValue('experiencia_laboral', candidato.experiencia_laboral || '');
            // No es posible cargar el CV ya existente en el input file
          }
        } catch (error) {
          console.error('Error al cargar candidato', error);
          setErrorMessage('Error al cargar los datos del candidato');
        }
      }
    };

    fetchCandidato();
  }, [candidatoId, setValue]);

  // Función para cargar sugerencias de autocompletado de educación
  const fetchEducacionSuggestions = async (inputValue: string) => {
    try {
      const suggestions = await candidatoService.getAutocompleteSuggestions('educacion', inputValue);
      return suggestions.map(item => ({ value: item, label: item }));
    } catch (error) {
      console.error('Error al obtener sugerencias de educación', error);
      return [];
    }
  };

  // Función para cargar sugerencias de autocompletado de experiencia
  const fetchExperienciaSuggestions = async (inputValue: string) => {
    try {
      const suggestions = await candidatoService.getAutocompleteSuggestions('experiencia_laboral', inputValue);
      return suggestions.map(item => ({ value: item, label: item }));
    } catch (error) {
      console.error('Error al obtener sugerencias de experiencia', error);
      return [];
    }
  };

  // Manejar cambio en input de educación para autocompletado
  const handleEducacionInputChange = async (inputValue: string) => {
    if (inputValue.length > 2) {
      const options = await fetchEducacionSuggestions(inputValue);
      setEducacionOptions(options);
    } else {
      setEducacionOptions([]);
    }
  };

  // Manejar cambio en input de experiencia para autocompletado
  const handleExperienciaInputChange = async (inputValue: string) => {
    if (inputValue.length > 2) {
      const options = await fetchExperienciaSuggestions(inputValue);
      setExperienciaOptions(options);
    } else {
      setExperienciaOptions([]);
    }
  };

  // Enviar formulario
  const onSubmit = async (data: CandidatoFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Crear un objeto FormData para enviar archivos
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      formData.append('apellido', data.apellido);
      formData.append('email', data.email);
      formData.append('telefono', data.telefono);
      formData.append('direccion', data.direccion || '');
      formData.append('educacion', data.educacion || '');
      formData.append('experiencia_laboral', data.experiencia_laboral || '');
      
      // Añadir el archivo CV si existe
      if (data.cv && data.cv.length > 0) {
        formData.append('cv', data.cv[0]);
      }
      
      let response;
      if (candidatoId) {
        // Actualizar candidato existente
        response = await candidatoService.updateCandidato(candidatoId, formData);
      } else {
        // Crear nuevo candidato
        response = await candidatoService.createCandidato(formData);
      }
      
      if (response.error) {
        setErrorMessage(response.mensaje || 'Error al procesar la solicitud');
      } else {
        setSuccessMessage(response.mensaje || 'Operación realizada con éxito');
        reset();
        setTimeout(() => {
          onSubmitSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al enviar formulario', error);
      setErrorMessage('Error al procesar la solicitud. Intente de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {candidatoId ? 'Editar Candidato' : 'Añadir Nuevo Candidato'}
      </h2>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección de información personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              className={`w-full p-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre del candidato"
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
            )}
          </div>
          
          {/* Apellido */}
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              id="apellido"
              type="text"
              className={`w-full p-2 border rounded-md ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Apellido del candidato"
              {...register('apellido')}
            />
            {errors.apellido && (
              <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              id="email"
              type="email"
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="ejemplo@correo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              id="telefono"
              type="text"
              className={`w-full p-2 border rounded-md ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="+1234567890"
              {...register('telefono')}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
            )}
          </div>
        </div>
        
        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            id="direccion"
            type="text"
            className={`w-full p-2 border rounded-md ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Dirección del candidato"
            {...register('direccion')}
          />
          {errors.direccion && (
            <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>
          )}
        </div>
        
        {/* Sección de educación y experiencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Educación con autocompletado */}
          <div>
            <label htmlFor="educacion" className="block text-sm font-medium text-gray-700 mb-1">
              Educación
            </label>
            <Controller
              name="educacion"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={educacionOptions}
                  onInputChange={handleEducacionInputChange}
                  onChange={(option) => field.onChange(option ? option.value : '')}
                  value={field.value ? { value: field.value, label: field.value } : null}
                  placeholder="Seleccione o escriba su nivel educativo"
                  isClearable
                  isSearchable
                  className="basic-single"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.educacion && (
              <p className="mt-1 text-sm text-red-600">{errors.educacion.message}</p>
            )}
          </div>
          
          {/* Experiencia Laboral con autocompletado */}
          <div>
            <label htmlFor="experiencia_laboral" className="block text-sm font-medium text-gray-700 mb-1">
              Experiencia Laboral
            </label>
            <Controller
              name="experiencia_laboral"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={experienciaOptions}
                  onInputChange={handleExperienciaInputChange}
                  onChange={(option) => field.onChange(option ? option.value : '')}
                  value={field.value ? { value: field.value, label: field.value } : null}
                  placeholder="Seleccione o escriba su experiencia laboral"
                  isClearable
                  isSearchable
                  className="basic-single"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.experiencia_laboral && (
              <p className="mt-1 text-sm text-red-600">{errors.experiencia_laboral.message}</p>
            )}
          </div>
        </div>
        
        {/* CV Carga de archivo */}
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
            {candidatoId ? 'CV (opcional para actualización)' : 'CV *'}
          </label>
          <input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={`w-full p-2 border rounded-md ${errors.cv ? 'border-red-500' : 'border-gray-300'}`}
            {...register('cv')}
          />
          <p className="mt-1 text-xs text-gray-500">
            Formatos aceptados: PDF, DOC, DOCX. Tamaño máximo: 5MB
          </p>
          {errors.cv && (
            <p className="mt-1 text-sm text-red-600">{errors.cv.message}</p>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Enviando...' : candidatoId ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCandidato; 