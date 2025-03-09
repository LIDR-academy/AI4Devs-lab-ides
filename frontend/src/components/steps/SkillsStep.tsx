import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from '../../context/FormContext';

// Tag component
const Tag = ({
  text,
  onRemove
}: {
  text: string;
  onRemove: () => void;
}) => (
  <div className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
    <span>{text}</span>
    <button
      type="button"
      onClick={onRemove}
      className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);

// Tag input component
const TagInput = ({
  id,
  label,
  placeholder,
  onAdd,
  error = ''
}: {
  id: string;
  label: string;
  placeholder: string;
  onAdd: (value: string) => void;
  error?: string;
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <form onSubmit={handleSubmit} className="flex">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </form>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const SkillsStep: React.FC = () => {
  const { t } = useTranslation();
  const { formData, addSkill, removeSkill, addLanguage, removeLanguage } = useFormContext();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('candidateForm.skills.title')}</h2>

      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-4">{t('candidateForm.skills.skills')}</h3>

        <TagInput
          id="skill"
          label={t('candidateForm.skills.skills')}
          placeholder={t('candidateForm.skills.addSkill')}
          onAdd={addSkill}
          error={errors.skills}
        />

        {formData.skills.length > 0 ? (
          <div className="mt-2">
            {formData.skills.map((skill, index) => (
              <Tag
                key={index}
                text={skill}
                onRemove={() => removeSkill(index)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No skills added yet</p>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-md">
        <h3 className="text-lg font-medium mb-4">{t('candidateForm.skills.languages')}</h3>

        <TagInput
          id="language"
          label={t('candidateForm.skills.languages')}
          placeholder={t('candidateForm.skills.addLanguage')}
          onAdd={addLanguage}
          error={errors.languages}
        />

        {formData.languages.length > 0 ? (
          <div className="mt-2">
            {formData.languages.map((language, index) => (
              <Tag
                key={index}
                text={language}
                onRemove={() => removeLanguage(index)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No languages added yet</p>
        )}
      </div>
    </div>
  );
};

export default SkillsStep;