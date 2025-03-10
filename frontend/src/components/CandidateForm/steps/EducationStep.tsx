import React from 'react';
import { useForm } from '../../../context/FormContext';
import { useFormNavigation } from '../../../context/FormContext';
import { Education } from '../../../types/candidate';

const EducationStep: React.FC = () => {
  const { state, dispatch } = useForm();
  const { formData } = state;
  const { goToPreviousStep, goToNextStep } = useFormNavigation();

  // Estas funciones se usan en el JSX
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleChange = (index: number, field: keyof Education, value: string | Date) => {
    const newEducation = [...formData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };

    dispatch({
      type: 'UPDATE_DATA',
      payload: { education: newEducation }
    });
  };

  const addEducation = () => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        education: [
          ...formData.education,
          {
            title: '',
            institution: '',
            startDate: new Date(),
            endDate: new Date()
          }
        ]
      }
    });
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      const newEducation = formData.education.filter((_, i) => i !== index);
      dispatch({
        type: 'UPDATE_DATA',
        payload: { education: newEducation }
      });
    }
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const handleNext = () => {
    // Validar que todos los campos estén completos
    const isValid = formData.education.every(edu => 
      edu.title.trim() !== '' && 
      edu.institution.trim() !== '' &&
      edu.startDate instanceof Date &&
      edu.endDate instanceof Date
    );

    if (isValid) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Education History
        </h2>

        <div className="space-y-6">
          {formData.education.map((edu, index) => (
            <div 
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">
                  Education #{index + 1}
                </h3>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor={`title-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Degree/Title *
                  </label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    value={edu.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor={`institution-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Institution *
                  </label>
                  <input
                    type="text"
                    id={`institution-${index}`}
                    value={edu.institution}
                    onChange={(e) => handleChange(index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor={`startDate-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id={`startDate-${index}`}
                      value={edu.startDate.toISOString().split('T')[0]}
                      onChange={(e) => handleChange(index, 'startDate', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor={`endDate-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date *
                    </label>
                    <input
                      type="date"
                      id={`endDate-${index}`}
                      value={edu.endDate.toISOString().split('T')[0]}
                      onChange={(e) => handleChange(index, 'endDate', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        >
          + Add Another Education
        </button>

        <p className="text-sm text-gray-500 mt-6">
          * Required fields
        </p>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Back
          </button>
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

export default EducationStep; 