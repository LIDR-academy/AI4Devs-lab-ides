import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { Control, useController } from 'react-hook-form';
import Select, { components, OptionProps, SingleValue, ActionMeta, MultiValue } from 'react-select';
import { useSearchSkills } from '../hooks/useCandidates';
import debounce from 'lodash/debounce';

interface SkillsInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
}

interface SkillOption {
  value: string;
  label: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  control,
  name,
  label = 'Habilidades',
  placeholder = 'Añadir habilidad...'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SkillOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<any>(null);
  
  // Usar useController para manejar el estado del campo
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  // Hook para buscar habilidades
  const { searchSkills } = useSearchSkills();

  // Asegurarse de que value siempre sea un array
  const skills = Array.isArray(value) ? value : [];

  // Función para buscar habilidades (con debounce)
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.trim().length === 0) {
        setOptions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchSkills(query);
        // Filtrar las habilidades que ya están seleccionadas
        const filteredResults = results.filter(skill => !skills.includes(skill));
        setOptions(filteredResults.map(skill => ({ value: skill, label: skill })));
      } catch (error) {
        console.error('Error al buscar habilidades:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // Limpiar el debounce al desmontar el componente
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Manejar cambios en el input
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  // Añadir una nueva habilidad
  const addSkill = (skillName: string) => {
    const trimmedValue = skillName.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      onChange([...skills, trimmedValue]);
      setInputValue('');
      setOptions([]);
      // Limpiar el input de react-select
      if (selectRef.current) {
        selectRef.current.clearValue();
      }
    }
  };

  // Manejar la selección de una opción
  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption && selectedOption.value) {
      addSkill(selectedOption.value);
    }
  };

  // Manejar la tecla Enter para añadir una habilidad personalizada
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  // Eliminar una habilidad
  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  // Componente personalizado para la opción
  const Option = (props: OptionProps<SkillOption>) => {
    return (
      <components.Option {...props}>
        <div className="flex items-center">
          <span>{props.data.label}</span>
        </div>
      </components.Option>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">
        {label}
      </label>
      
      {/* Mostrar las habilidades como etiquetas */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div 
              key={index} 
              className="bg-steel-blue-100 text-steel-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 text-steel-blue-600 hover:text-steel-blue-800 focus:outline-none"
              >
                <FiX size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No hay habilidades añadidas</div>
        )}
      </div>
      
      {/* Campo de entrada con autocompletado */}
      <div className="flex">
        <div className="flex-grow">
          <Select
            ref={selectRef}
            options={options}
            onInputChange={handleInputChange}
            onChange={handleSelectChange}
            isLoading={isLoading}
            placeholder={placeholder}
            noOptionsMessage={() => 
              inputValue.trim() 
                ? "No se encontraron habilidades. Presiona Enter para añadir una nueva." 
                : "Escribe para buscar habilidades"
            }
            components={{ Option }}
            onKeyDown={handleKeyDown}
            isClearable
            isSearchable
            className="rounded-l-md"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderColor: '#D1D5DB',
                '&:hover': {
                  borderColor: '#9CA3AF',
                },
              }),
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => inputValue.trim() && addSkill(inputValue)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
          disabled={!inputValue.trim()}
        >
          <FiPlus className="mr-1" />
          Añadir
        </button>
      </div>
    </div>
  );
};

export default SkillsInput; 