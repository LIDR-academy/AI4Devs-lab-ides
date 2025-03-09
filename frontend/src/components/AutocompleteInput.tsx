import React, { useState, useEffect, useRef, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface AutocompleteInputProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  suggestions: string[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onSelect: (value: string) => void;
  register: UseFormRegisterReturn;
  className?: string;
  labelClassName?: string;
  isTextarea?: boolean;
  rows?: number;
  value?: string;
}

const AutocompleteInput = forwardRef<
  HTMLTextAreaElement | HTMLInputElement,
  AutocompleteInputProps
>(
  (
    {
      id,
      label,
      placeholder,
      required,
      error,
      suggestions,
      isLoading,
      onSearch,
      onSelect,
      register,
      className = "",
      labelClassName = "",
      isTextarea = false,
      rows = 3,
      value = "",
    },
    ref
  ) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
      null
    );
    const suggestionsRef = useRef<HTMLUListElement>(null);

    // Update internal state when value prop changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // Handle input change with debounce
    useEffect(() => {
      const handler = setTimeout(() => {
        onSearch(inputValue);
      }, 300); // 300ms debounce

      return () => {
        clearTimeout(handler);
      };
    }, [inputValue, onSearch]);

    // Handle click outside to close suggestions
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          internalRef.current &&
          !internalRef.current.contains(event.target as Node) &&
          suggestionsRef.current &&
          !suggestionsRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showSuggestions) return;

      // Arrow down
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
      // Arrow up
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
      // Enter
      else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
      }
      // Escape
      else if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
      }
      // Tab
      else if (e.key === "Tab") {
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[highlightedIndex]);
        } else {
          setShowSuggestions(false);
        }
      }
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value = e.target.value;
      setInputValue(value);
      onSelect(value); // Update form value

      if (value.trim() === "") {
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true);
      }
    };

    const handleSelectSuggestion = (suggestion: string) => {
      setInputValue(suggestion);
      onSelect(suggestion);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      internalRef.current?.focus();
    };

    // Determine label class based on required status
    const labelClass = required
      ? `block text-sm font-medium text-gray-700 mb-1 after:content-['*'] after:ml-0.5 after:text-red-500 ${labelClassName}`
      : `block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`;

    // Determine input class based on error status
    const inputClass = `w-full p-2 border rounded ${
      error ? "border-red-500" : "border-gray-300"
    } ${className}`;

    return (
      <div className="relative">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>

        {isTextarea ? (
          <textarea
            id={id}
            {...register}
            ref={(element) => {
              // Set internal ref
              internalRef.current = element;

              // Forward ref
              if (typeof ref === "function") {
                ref(element);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLTextAreaElement | null>
                ).current = element;
              }
            }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim() !== "") {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            rows={rows}
            className={inputClass}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? `${id}-suggestions` : undefined}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `${id}-suggestion-${highlightedIndex}`
                : undefined
            }
          />
        ) : (
          <input
            id={id}
            type="text"
            {...register}
            ref={(element) => {
              // Set internal ref
              internalRef.current = element;

              // Forward ref
              if (typeof ref === "function") {
                ref(element);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = element;
              }
            }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim() !== "") {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className={inputClass}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? `${id}-suggestions` : undefined}
            aria-activedescendant={
              highlightedIndex >= 0
                ? `${id}-suggestion-${highlightedIndex}`
                : undefined
            }
          />
        )}

        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {showSuggestions && (
          <ul
            id={`${id}-suggestions`}
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
            role="listbox"
          >
            {isLoading ? (
              <li className="text-gray-500 px-4 py-2">Loading...</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li
                  id={`${id}-suggestion-${index}`}
                  key={`${suggestion}-${index}`}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                    highlightedIndex === index
                      ? "text-white bg-blue-600"
                      : "text-gray-900"
                  }`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {suggestion}
                </li>
              ))
            ) : (
              <li className="text-gray-500 px-4 py-2">No suggestions found</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

AutocompleteInput.displayName = "AutocompleteInput";

export default AutocompleteInput;
