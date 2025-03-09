import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isFile?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate a single field
  const validateField = (
    name: string,
    value: any,
    rules: ValidationRules
  ): string => {
    // Required field validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es obligatorio';
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) {
      return '';
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        return `Debe tener al menos ${rules.minLength} caracteres`;
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Debe tener como máximo ${rules.maxLength} caracteres`;
      }

      // Email validation
      if (rules.isEmail && !emailRegex.test(value)) {
        return 'Debe ser un email válido';
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Formato inválido';
      }
    }

    // File validations
    if (rules.isFile && value instanceof File) {
      // File type validation
      if (
        rules.allowedFileTypes &&
        !rules.allowedFileTypes.includes(value.type)
      ) {
        return `Tipo de archivo no permitido. Formatos aceptados: ${rules.allowedFileTypes.join(', ')}`;
      }

      // File size validation
      if (rules.maxFileSize && value.size > rules.maxFileSize) {
        const maxSizeMB = rules.maxFileSize / (1024 * 1024);
        return `El archivo excede el tamaño máximo de ${maxSizeMB} MB`;
      }
    }

    return '';
  };

  // Validate all fields in a form
  const validateForm = (
    formData: Record<string, any>,
    validationRules: Record<string, ValidationRules>
  ): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(validationRules).forEach((fieldName) => {
      const value = formData[fieldName];
      const rules = validationRules[fieldName];
      const error = validateField(fieldName, value, rules);

      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    validateForm,
    validateField,
    setErrors,
  };
};

export default useFormValidation; 