import React, { useState } from 'react';
import './AutocompleteInput.css';

interface AutocompleteInputProps {
  label: string;
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  suggestions,
  value,
  onChange,
  error
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputId = `autocomplete-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="autocomplete-wrapper">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <ul className="suggestions-list">
          {suggestions
            .filter(item => item.toLowerCase().includes(value.toLowerCase()))
            .map((item, index) => (
              <li 
                key={index}
                onClick={() => {
                  onChange(item);
                  setShowSuggestions(false);
                }}
              >
                {item}
              </li>
            ))}
        </ul>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}; 