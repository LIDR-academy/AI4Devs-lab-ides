import React, { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { Control, useController } from 'react-hook-form';

interface SkillsInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  control,
  name,
  label = 'Habilidades',
  placeholder = 'Añadir habilidad...'
}) => {
  const [inputValue, setInputValue] = useState('');
  
  // Usar useController para manejar el estado del campo
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  // Asegurarse de que value siempre sea un array
  const skills = Array.isArray(value) ? value : [];

  // Añadir una nueva habilidad
  const addSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      onChange([...skills, trimmedValue]);
      setInputValue('');
    }
  };

  // Eliminar una habilidad
  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  // Manejar la tecla Enter para añadir una habilidad
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
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
      
      {/* Campo de entrada para nuevas habilidades */}
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-steel-blue-500 focus:ring-steel-blue-500 sm:text-sm px-3 py-2"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-steel-blue-600 hover:bg-steel-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-steel-blue-500"
        >
          <FiPlus className="mr-1" />
          Añadir
        </button>
      </div>
    </div>
  );
};

export default SkillsInput; 