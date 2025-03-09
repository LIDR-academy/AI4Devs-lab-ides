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

// Text area component
const TextAreaField = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = ''
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={3}
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? 'border-red-300' : 'border-gray-300'
      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Education item component
const EducationItem = ({
  index,
  education,
  updateEducation,
  removeEducation,
  errors = {}
}: {
  index: number;
  education: {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    summary?: string;
  };
  updateEducation: (index: number, data: any) => void;
  removeEducation: (index: number) => void;
  errors?: { [key: string]: string };
}) => {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateEducation(index, { [id.replace(`education${index}_`, '')]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    updateEducation(index, { [id.replace(`education${index}_`, '')]: value });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-medium">{t('candidateForm.education.title')} #{index + 1}</h3>
        <button
          type="button"
          onClick={() => removeEducation(index)}
          className="text-red-600 hover:text-red-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <InputField
        id={`education${index}_institution`}
        label={t('candidateForm.education.institution')}
        value={education.institution}
        onChange={handleInputChange}
        required
        error={errors[`education${index}_institution`]}
      />

      <InputField
        id={`education${index}_degree`}
        label={t('candidateForm.education.degree')}
        value={education.degree}
        onChange={handleInputChange}
        required
        error={errors[`education${index}_degree`]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id={`education${index}_startDate`}
          label={t('candidateForm.education.startDate')}
          type="date"
          value={education.startDate}
          onChange={handleInputChange}
          required
          error={errors[`education${index}_startDate`]}
        />

        <InputField
          id={`education${index}_endDate`}
          label={t('candidateForm.education.endDate')}
          type="date"
          value={education.endDate}
          onChange={handleInputChange}
          error={errors[`education${index}_endDate`]}
        />
      </div>

      <TextAreaField
        id={`education${index}_summary`}
        label={t('candidateForm.education.summary')}
        value={education.summary || ''}
        onChange={handleTextAreaChange}
        error={errors[`education${index}_summary`]}
      />
    </div>
  );
};

const EducationStep: React.FC = () => {
  const { t } = useTranslation();
  const { formData, addEducation, updateEducation, removeEducation } = useFormContext();
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('candidateForm.education.title')}</h2>

      {formData.education.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">{t('candidateForm.education.title')}</p>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('candidateForm.education.addEducation')}
          </button>
        </div>
      ) : (
        <>
          {formData.education.map((edu, index) => (
            <EducationItem
              key={index}
              index={index}
              education={edu}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
              errors={errors}
            />
          ))}

          <div className="mt-4">
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('candidateForm.education.addEducation')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EducationStep;