import React from 'react';
import { useForm } from '../../../context/FormContext';
import { useFormNavigation } from '../../../context/FormContext';
import { WorkExperience } from '../../../types/candidate';

const ExperienceStep: React.FC = () => {
  const { state, dispatch } = useForm();
  const { formData } = state;
  const { goToPreviousStep, goToNextStep } = useFormNavigation();

  const handleChange = (index: number, field: keyof WorkExperience, value: string | Date) => {
    const newExperience = [...formData.workExperience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    };

    dispatch({
      type: 'UPDATE_DATA',
      payload: { workExperience: newExperience }
    });
  };

  const addExperience = () => {
    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        workExperience: [
          ...formData.workExperience,
          {
            company: '',
            position: '',
            startDate: new Date(),
            endDate: new Date()
          }
        ]
      }
    });
  };

  const removeExperience = (index: number) => {
    if (formData.workExperience.length > 1) {
      const newExperience = formData.workExperience.filter((_, i) => i !== index);
      dispatch({
        type: 'UPDATE_DATA',
        payload: { workExperience: newExperience }
      });
    }
  };

  const handleNext = () => {
    // Validar que todos los campos estén completos
    const isValid = formData.workExperience.every(exp => 
      exp.company.trim() !== '' && 
      exp.position.trim() !== '' &&
      exp.startDate instanceof Date &&
      exp.endDate instanceof Date
    );

    if (isValid) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Work Experience
        </h2>

        <div className="space-y-6">
          {formData.workExperience.map((exp, index) => (
            <div 
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-700">
                  Experience #{index + 1}
                </h3>
                {formData.workExperience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor={`position-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Position *
                  </label>
                  <input
                    type="text"
                    id={`position-${index}`}
                    value={exp.position}
                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor={`company-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company *
                  </label>
                  <input
                    type="text"
                    id={`company-${index}`}
                    value={exp.company}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Tech Company Inc."
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
                      value={exp.startDate.toISOString().split('T')[0]}
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
                      value={exp.endDate.toISOString().split('T')[0]}
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
          onClick={addExperience}
          className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        >
          + Add Another Experience
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

export default ExperienceStep; 