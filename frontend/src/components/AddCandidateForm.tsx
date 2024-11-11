import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CandidateFormData {
  // Personal Information
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  
  // Education
  educacion: Education[];
  
  // Experience
  experiencia: Experience[];
  
  // Documents
  cv: FileList;
}

interface AddCandidateFormProps {
  onClose: () => void;
}

export const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, control, formState: { errors }, trigger } = useForm<CandidateFormData>({
    defaultValues: {
      educacion: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
      experiencia: [{ company: '', position: '', startDate: '', endDate: '', description: '' }]
    },
    mode: 'onChange'
  });
  
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "educacion"
  });
  
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experiencia"
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CandidateFormData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append personal information
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'cv') {
          if (value[0]) formData.append('cv', value[0]);
        } else if (key === 'educacion' || key === 'experiencia') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidates`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al guardar candidato');

      toast.success('Candidato añadido exitosamente');
      onClose();
    } catch (error) {
      toast.error('Error al añadir candidato');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === currentStep
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : step < currentStep
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-24 h-0.5 ${
                  step < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  {...register('nombre', { 
                    required: 'El nombre es requerido',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="John"
                />
                {errors.nombre && <span className="text-red-500 text-xs mt-1">{errors.nombre.message}</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  {...register('apellido', { required: 'Este campo es requerido' })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Doe"
                />
                {errors.apellido && <span className="text-red-500 text-xs mt-1">{errors.apellido.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  {...register('telefono')}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  {...register('direccion')}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Education</h2>
            {educationFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Institution</label>
                    <input
                      {...register(`educacion.${index}.institution`, {
                        required: 'La institución es requerida'
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="University name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input
                      {...register(`educacion.${index}.degree`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Bachelor's, Master's"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Field of Study</label>
                    <input
                      {...register(`educacion.${index}.fieldOfStudy`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register(`educacion.${index}.startDate`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      {...register(`educacion.${index}.endDate`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendEducation({ 
                institution: '', 
                degree: '', 
                fieldOfStudy: '', 
                startDate: '', 
                endDate: '' 
              })}
              className="w-full p-2 mt-4 text-center border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
            >
              + Add Education
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Professional Experience</h2>
            {experienceFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      {...register(`experiencia.${index}.company`, {
                        required: 'La empresa es requerida'
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <input
                      {...register(`experiencia.${index}.position`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Job title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register(`experiencia.${index}.startDate`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      {...register(`experiencia.${index}.endDate`)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      {...register(`experiencia.${index}.description`)}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendExperience({ 
                company: '', 
                position: '', 
                startDate: '', 
                endDate: '', 
                description: '' 
              })}
              className="w-full p-2 mt-4 text-center border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
            >
              + Add Experience
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upload Documents</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  Drag and drop your CV here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, DOCX (Max 10MB)
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('cv')?.click()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Select File
                </button>
                <input
                  id="cv"
                  type="file"
                  {...register('cv', {
                    required: 'El CV es requerido',
                    validate: {
                      fileSize: (files) => !files[0] || files[0].size <= 10000000 || 'El archivo debe ser menor a 10MB',
                      fileType: (files) => 
                        !files[0] || 
                        ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0].type) ||
                        'Solo se permiten archivos PDF o DOCX'
                    }
                  })}
                  className="hidden"
                  accept=".pdf,.docx"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const validateStep = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await trigger(['nombre', 'apellido', 'email', 'telefono', 'direccion']);
        break;
      case 2:
        isValid = await trigger('educacion');
        break;
      case 3:
        isValid = await trigger('experiencia');
        break;
      case 4:
        isValid = await trigger('cv');
        break;
      default:
        isValid = false;
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    } else {
      toast.error('Por favor complete todos los campos requeridos');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto p-6">
      {renderProgressBar()}
      {renderStep()}
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="px-4 py-2 text-blue-500 hover:text-blue-600"
          >
            Previous
          </button>
        )}
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
          >
            Next
          </button>
        ) : (
          <div className="flex gap-4 ml-auto">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 text-blue-500 hover:text-blue-600"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}; 