import { useState, ChangeEvent } from 'react';

export const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  // Handle text input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialState);
  };

  // Update form data directly
  const updateFormData = (newData: Partial<T>) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return {
    formData,
    handleInputChange,
    handleFileChange,
    resetForm,
    updateFormData,
    setFormData,
  };
};

export default useFormState; 