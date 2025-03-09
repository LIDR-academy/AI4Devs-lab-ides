import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../context/FormContext';

// Input field component
const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = ''
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? 'border-red-300' : 'border-gray-300'
      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const PersonalInfoStep: React.FC = () => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormContext();
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // Update form data in context
    if (id === 'desiredSalary') {
      updateFormData({ [id]: value ? parseFloat(value) : undefined });
    } else {
      updateFormData({ [id]: value });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('candidateForm.steps.personalInfo')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="firstName"
          label={t('candidateForm.personalInfo.firstName')}
          value={formData.firstName}
          onChange={handleChange}
          required
          error={errors.firstName}
        />

        <InputField
          id="lastName"
          label={t('candidateForm.personalInfo.lastName')}
          value={formData.lastName}
          onChange={handleChange}
          required
          error={errors.lastName}
        />
      </div>

      <InputField
        id="email"
        label={t('candidateForm.personalInfo.email')}
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={errors.email}
      />

      <InputField
        id="phone"
        label={t('candidateForm.personalInfo.phone')}
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
        error={errors.phone}
      />

      <InputField
        id="address"
        label={t('candidateForm.personalInfo.address')}
        value={formData.address}
        onChange={handleChange}
        required
        error={errors.address}
      />

      <InputField
        id="linkedinProfile"
        label={t('candidateForm.personalInfo.linkedinProfile')}
        value={formData.linkedinProfile || ''}
        onChange={handleChange}
        placeholder="https://linkedin.com/in/username"
        error={errors.linkedinProfile}
      />

      <InputField
        id="desiredSalary"
        label={t('candidateForm.personalInfo.desiredSalary')}
        type="number"
        value={formData.desiredSalary?.toString() || ''}
        onChange={handleChange}
        error={errors.desiredSalary}
      />
    </div>
  );
};

export default PersonalInfoStep;