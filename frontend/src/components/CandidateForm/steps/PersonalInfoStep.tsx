import React, { useState } from 'react';
import { useForm, useFormNavigation } from '../../../context/FormContext';
import { ValidationError } from '../../../utils/validation';
import type { FormStep } from '../../../types/candidate';

// Iconos temporales hasta que instalemos heroicons
const ExclamationCircleIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string; 'aria-hidden'?: boolean }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

interface PersonalFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FieldError {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const PersonalInfoStep: React.FC = () => {
  const { state, dispatch } = useForm();
  const { formData } = state;
  const { goToNextStep } = useFormNavigation();
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getFieldLabel = (name: string): string => {
    switch (name) {
      case 'firstName':
        return 'First name';
      case 'lastName':
        return 'Last name';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone number';
      default:
        return name;
    }
  };

  const getFieldPlaceholder = (name: string): string => {
    switch (name) {
      case 'firstName':
        return 'Enter your first name';
      case 'lastName':
        return 'Enter your last name';
      case 'email':
        return 'example@domain.com';
      case 'phone':
        return '+1 234 567 890';
      default:
        return '';
    }
  };

  const validateField = (name: string, value: string): boolean => {
    try {
      // Si hay valor, validar el formato primero
      if (value.trim()) {
        switch (name) {
          case 'email':
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
              throw new ValidationError('Invalid email format');
            }
            break;
          case 'phone':
            if (!/^\+?[\d\s-]{10,}$/.test(value)) {
              throw new ValidationError('Invalid phone number format');
            }
            break;
        }
      } else {
        // Si no hay valor, mostrar error de campo requerido
        throw new ValidationError(`${getFieldLabel(name)} is required`);
      }
      
      // Si pasa todas las validaciones, limpiar el error
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof ValidationError || error instanceof Error) {
        errorMessage = error.message;
      }
      
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_DATA',
      payload: { [name]: value }
    });
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const renderField = (name: keyof PersonalFormData, type: string = 'text') => {
    const error = errors[name];
    const isValid = touched[name] && !error;
    const errorId = `${name}-error`;
    const value = (formData as PersonalFormData)[name] || '';

    return (
      <div className="relative">
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {getFieldLabel(name)} *
        </label>
        <div className="relative">
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`
              w-full px-3 py-2 pr-10 border rounded-md 
              transition-colors duration-200
              focus:outline-none focus:ring-2
              ${error 
                ? 'border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300' 
                : isValid
                  ? 'border-green-500 focus:ring-green-200 text-green-900'
                  : 'border-gray-300 focus:ring-blue-200 hover:border-gray-400'
              }
            `}
            placeholder={getFieldPlaceholder(name)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            required
          />
          {error && (
            <ExclamationCircleIcon 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500"
              aria-hidden={true}
            />
          )}
          {isValid && (
            <CheckCircleIcon 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500"
              aria-hidden={true}
            />
          )}
        </div>
        {error && (
          <p 
            id={errorId}
            role="alert" 
            className="mt-1 text-sm text-red-600 flex items-center gap-1"
          >
            {error}
          </p>
        )}
        {!error && touched[name] && (
          <p className="mt-1 text-sm text-green-600">
            Looks good!
          </p>
        )}
      </div>
    );
  };

  const handleNext = () => {
    // Validar todos los campos antes de continuar
    const fields = ['firstName', 'lastName', 'email', 'phone'] as const;
    let isValid = true;

    fields.forEach(field => {
      const value = (formData as PersonalFormData)[field];
      if (!validateField(field, value || '')) {
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    if (isValid) {
      dispatch({ type: 'SET_STEP', payload: 'education' });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Personal Information
        </h2>

        <div className="space-y-6">
          {renderField('firstName')}
          {renderField('lastName')}
          {renderField('email', 'email')}
          {renderField('phone', 'tel')}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          * Required fields
        </p>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep; 