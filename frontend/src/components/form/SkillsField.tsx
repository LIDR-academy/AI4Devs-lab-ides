import React, { useState, useRef, useEffect } from 'react';
import Icon from '../common/Icon';

interface SkillsFieldProps {
  value: string[];
  onChange: (skills: string[]) => void;
  suggestions?: string[];
  maxItems?: number;
  required?: boolean;
  label?: string;
  error?: string;
}

const SkillsField: React.FC<SkillsFieldProps> = ({
  value = [],
  onChange,
  suggestions = [],
  maxItems = 20,
  required = false,
  label = 'Habilidades',
  error,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filtrar sugerencias basadas en el valor de entrada
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter(
      suggestion => suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [inputValue, suggestions]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Añadir una habilidad
  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill === '' || value.length >= maxItems) return;

    // Evitar duplicados
    if (!value.includes(trimmedSkill)) {
      if (isEditing !== null) {
        // Editar habilidad existente
        const newSkills = [...value];
        newSkills[isEditing] = trimmedSkill;
        onChange(newSkills);
        setIsEditing(null);
      } else {
        // Añadir nueva habilidad
        onChange([...value, trimmedSkill]);
      }
    }

    setInputValue('');
    setShowSuggestions(false);
  };

  // Eliminar una habilidad
  const removeSkill = (index: number) => {
    const newSkills = [...value];
    newSkills.splice(index, 1);
    onChange(newSkills);
    
    // Si estábamos editando esta habilidad, cancelar la edición
    if (isEditing === index) {
      setIsEditing(null);
      setInputValue('');
    }
  };

  // Editar una habilidad
  const editSkill = (index: number) => {
    setInputValue(value[index]);
    setIsEditing(index);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Manejar teclas especiales (Enter, Escape, etc.)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
      setIsEditing(null);
    } else if (e.key === 'ArrowDown' && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault();
      // Aquí se podría implementar la navegación por teclado en las sugerencias
    }
  };

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Seleccionar una sugerencia
  const selectSuggestion = (suggestion: string) => {
    addSkill(suggestion);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div 
          className={`flex flex-wrap gap-2 p-2 border rounded-md min-h-[80px] ${
            error ? 'border-error-500' : 'border-gray-300'
          } focus-within:ring-2 focus-within:ring-primary focus-within:border-primary`}
        >
          {/* Habilidades existentes */}
          {value.map((skill, index) => (
            <div 
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
            >
              <span className="mr-1">{skill}</span>
              <button
                type="button"
                onClick={() => editSkill(index)}
                className="text-blue-600 hover:text-blue-800 mr-1"
                aria-label={`Editar habilidad ${skill}`}
              >
                <Icon name="edit" size="xs" />
              </button>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-blue-600 hover:text-blue-800"
                aria-label={`Eliminar habilidad ${skill}`}
              >
                <Icon name="close" size="xs" />
              </button>
            </div>
          ))}

          {/* Input para añadir nuevas habilidades */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="flex-grow min-w-[150px] border-0 p-1 focus:ring-0 focus:outline-none"
            placeholder={value.length === 0 ? "Añade habilidades..." : ""}
            aria-label="Añadir habilidad"
            disabled={value.length >= maxItems}
          />
        </div>

        {/* Sugerencias */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}

      {/* Contador de habilidades */}
      <p className="mt-1 text-xs text-gray-500">
        {value.length} de {maxItems} habilidades
      </p>

      {/* Instrucciones */}
      <p className="mt-1 text-xs text-gray-500">
        Presiona Enter para añadir una habilidad
      </p>
    </div>
  );
};

export default SkillsField; 