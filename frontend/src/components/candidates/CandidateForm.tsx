import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { createCandidate } from '../../services/candidateService';
import { Candidate, Education, Experience as WorkExperience } from '../../types/candidate.types';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useAlert } from '../../hooks/useAlert';
import { useFormSteps } from '../../hooks/useFormSteps';
import { Alert } from '../common/Alert';
import { FormSteps } from '../common/FormSteps';
import FileUpload from '../forms/FileUpload';
import './CandidateForm.css';

interface CandidateFormData extends Omit<Candidate, 'education' | 'workExperience'> {
  education: Education[];
  workExperience: WorkExperience[];
  resume?: File;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp?: string;
  code?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

const CandidateForm: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { showAlert, alertMessage, alertType, displayAlert, hideAlert } = useAlert();
  const { currentStep, steps, nextStep, prevStep, isFirstStep, isLastStep } = useFormSteps();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const { register, handleSubmit, control, formState: { errors }, getValues } = useForm<CandidateFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      education: [{ 
        institution: '', 
        degree: '', 
        fieldOfStudy: '', 
        startDate: '', 
        endDate: '', 
        current: false 
      }],
      workExperience: [{ 
        company: '', 
        position: '', 
        description: '', 
        startDate: '', 
        endDate: '', 
        current: false 
      }],
      notes: '',
    },
    mode: 'onChange'
  });
  
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });
  
  const { fields: workExperienceFields, append: appendWorkExperience, remove: removeWorkExperience } = useFieldArray({
    control,
    name: 'workExperience'
  });
  
  const validateName = (value: string | undefined) => {
    if (!value) return 'El nombre es obligatorio';
    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (value.length > 50) return 'El nombre no puede exceder los 50 caracteres';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras y espacios';
    return true;
  };
  
  const validateEmail = (email: string | undefined) => {
    if (!email) return 'El email es obligatorio';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) return 'Por favor ingrese un email válido';
    return true;
  };
  
  const validatePhone = (value: string | undefined) => {
    if (!value) return 'El teléfono es obligatorio';
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(value)) return 'Por favor ingrese un número de teléfono válido';
    if (value.length > 20) return 'El teléfono no puede exceder los 20 caracteres';
    return true;
  };

  const validateAddress = (value: string | undefined) => {
    if (!value) return 'La dirección es obligatoria';
    if (value.length < 5) return 'La dirección debe tener al menos 5 caracteres';
    if (value.length > 200) return 'La dirección no puede exceder los 200 caracteres';
    return true;
  };
  
  const validateEducation = (education: Education) => {
    if (!education) return 'La información de educación es obligatoria';
    if (!education.institution || education.institution.length < 2) return 'La institución debe tener al menos 2 caracteres';
    if (!education.degree || education.degree.length < 2) return 'El título debe tener al menos 2 caracteres';
    if (!education.fieldOfStudy || education.fieldOfStudy.length < 2) return 'El campo de estudio debe tener al menos 2 caracteres';
    if (!education.startDate) return 'La fecha de inicio es obligatoria';
    if (!education.endDate) return 'La fecha de finalización es obligatoria';
    
    // Validar que la fecha de fin sea posterior a la de inicio
    const startDate = new Date(education.startDate);
    const endDate = new Date(education.endDate);
    if (startDate > endDate) return 'La fecha de finalización debe ser posterior a la fecha de inicio';
    
    return true;
  };

  const validateWorkExperience = (experience: WorkExperience) => {
    if (!experience) return 'La información de experiencia es obligatoria';
    if (!experience.company || experience.company.length < 2) return 'La empresa debe tener al menos 2 caracteres';
    if (!experience.position || experience.position.length < 2) return 'La posición debe tener al menos 2 caracteres';
    if (!experience.startDate) return 'La fecha de inicio es obligatoria';
    if (!experience.endDate) return 'La fecha de finalización es obligatoria';
    
    // Validar que la fecha de fin sea posterior a la de inicio
    const startDate = new Date(experience.startDate);
    const endDate = new Date(experience.endDate);
    if (startDate > endDate) return 'La fecha de finalización debe ser posterior a la fecha de inicio';
    
    return true;
  };

  const isStepValid = () => {
    const values = getValues();
    
    switch (currentStep) {
      case 1:
        return (
          validateName(values.firstName) === true &&
          validateName(values.lastName) === true &&
          validateEmail(values.email) === true &&
          validatePhone(values.phone) === true &&
          validateAddress(values.address) === true
        );
      case 2:
        // Validar al menos la primera entrada de educación
        if (values.education.length === 0) return false;
        const education = values.education[0];
        
        // Validar que todos los campos requeridos estén presentes
        if (!education.institution || !education.degree || !education.fieldOfStudy || 
            !education.startDate || !education.endDate) {
          return false;
        }

        // Validar longitudes mínimas
        if (education.institution.length < 2 || education.degree.length < 2 || 
            education.fieldOfStudy.length < 2) {
          return false;
        }

        // Validar fechas
        const eduStartDate = new Date(education.startDate);
        const eduEndDate = new Date(education.endDate);
        
        // Asegurarse de que las fechas son válidas
        if (isNaN(eduStartDate.getTime()) || isNaN(eduEndDate.getTime())) {
          return false;
        }

        return eduStartDate <= eduEndDate;

      case 3:
        // Validar al menos la primera entrada de experiencia
        if (values.workExperience.length === 0) return false;
        const experience = values.workExperience[0];
        
        // Validar que todos los campos requeridos estén presentes
        if (!experience.company || !experience.position || !experience.startDate || 
            !experience.endDate) {
          return false;
        }

        // Validar longitudes mínimas
        if (experience.company.length < 2 || experience.position.length < 2) {
          return false;
        }

        // Validar fechas
        const expStartDate = new Date(experience.startDate);
        const expEndDate = new Date(experience.endDate);
        
        // Asegurarse de que las fechas son válidas
        if (isNaN(expStartDate.getTime()) || isNaN(expEndDate.getTime())) {
          return false;
        }

        return expStartDate <= expEndDate;

      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleStepNavigation = (direction: 'next' | 'prev') => {
    const values = getValues();
    
    if (direction === 'next') {
      let isValid = true;
      let errorMessage = '';
      
      switch (currentStep) {
        case 1:
          isValid = validateName(values.firstName) === true &&
                   validateName(values.lastName) === true &&
                   validateEmail(values.email) === true &&
                   validatePhone(values.phone) === true &&
                   validateAddress(values.address) === true;
          break;
        case 2:
          if (values.education.length === 0) {
            isValid = false;
            errorMessage = 'Debe agregar al menos una entrada de educación';
          } else {
            const education = values.education[0];
            isValid = Boolean(
              education.institution &&
              education.institution.length >= 2 &&
              education.degree &&
              education.degree.length >= 2 &&
              education.fieldOfStudy &&
              education.fieldOfStudy.length >= 2 &&
              education.startDate &&
              education.endDate &&
              new Date(education.startDate) <= new Date(education.endDate)
            );
            if (!isValid) {
              errorMessage = 'Por favor complete todos los campos de educación correctamente';
            }
          }
          break;
        case 3:
          if (values.workExperience.length === 0) {
            isValid = false;
            errorMessage = 'Debe agregar al menos una entrada de experiencia';
          } else {
            const experience = values.workExperience[0];
            isValid = Boolean(
              experience.company &&
              experience.company.length >= 2 &&
              experience.position &&
              experience.position.length >= 2 &&
              experience.startDate &&
              experience.endDate &&
              new Date(experience.startDate) <= new Date(experience.endDate)
            );
            if (!isValid) {
              errorMessage = 'Por favor complete todos los campos de experiencia correctamente';
            }
          }
          break;
        default:
          isValid = true;
      }

      if (isValid) {
        nextStep();
      } else {
        displayAlert(errorMessage || 'Por favor complete todos los campos requeridos', 'error');
      }
    } else {
      prevStep();
    }
  };
  
  const onSubmit = async (data: CandidateFormData, e?: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!isLastStep) {
      handleStepNavigation('next');
      return;
    }

    try {
      if (isSubmitting) return;
      
      setIsSubmitting(true);
      displayAlert('Guardando candidato...', 'info');

      // Limpiar y preparar los datos
      const education = data.education
        .filter(edu => edu.institution && edu.degree && edu.fieldOfStudy && edu.startDate)
        .map(edu => ({
          ...edu,
          startDate: new Date(edu.startDate),
          endDate: edu.endDate ? new Date(edu.endDate) : undefined
        }));

      const experience = data.workExperience
        .filter(exp => exp.company && exp.position && exp.description && exp.startDate)
        .map(exp => ({
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : undefined
        }));

      const candidateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        education,
        experience,
        notes: data.notes || undefined
      };
      
      
      const response = await createCandidate(candidateData, resumeFile || undefined);
      
      if (response.status === 'success') {
        displayAlert(response.message, 'success');
        setTimeout(() => {
          navigate(`/candidates/${response.data?.id}/summary`, { 
            state: { candidate: response.data }
          });
        }, 1500);
      } else {
        throw response;
      }
    } catch (err: any) {
      let errorMessage = 'Ha ocurrido un error al crear el candidato.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      displayAlert(errorMessage, 'error');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`candidate-form-container ${isMobile ? 'mobile' : ''}`}>
      <h2>Añadir Nuevo Candidato</h2>
      
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={hideAlert}
        />
      )}
      
      <FormSteps steps={steps} currentStep={currentStep} />
      
      <form onSubmit={(e) => {
        e.preventDefault(); // Siempre prevenir el envío por defecto
      }}>
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Información Personal</h3>
            
            <div className="form-group">
              <label htmlFor="firstName">Nombre <span className="required-field">*</span></label>
              <input
                id="firstName"
                type="text"
                placeholder="Ingrese su nombre"
                className={errors.firstName ? 'error' : ''}
                {...register('firstName', { 
                  required: 'El nombre es obligatorio',
                  validate: validateName
                })}
              />
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Apellido <span className="required-field">*</span></label>
              <input
                id="lastName"
                type="text"
                placeholder="Ingrese su apellido"
                className={errors.lastName ? 'error' : ''}
                {...register('lastName', { 
                  required: 'El apellido es obligatorio',
                  validate: validateName
                })}
              />
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email <span className="required-field">*</span></label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@dominio.com"
                className={errors.email ? 'error' : ''}
                {...register('email', { 
                  required: 'El email es obligatorio',
                  validate: validateEmail
                })}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Teléfono <span className="required-field">*</span></label>
              <input
                id="phone"
                type="tel"
                placeholder="+XX XXX XXX XXX"
                className={errors.phone ? 'error' : ''}
                {...register('phone', {
                  required: 'El teléfono es obligatorio',
                  validate: validatePhone
                })}
              />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Dirección <span className="required-field">*</span></label>
              <textarea
                id="address"
                placeholder="Ingrese su dirección completa"
                className={errors.address ? 'error' : ''}
                {...register('address', {
                  required: 'La dirección es obligatoria',
                  validate: validateAddress
                })}
              />
              {errors.address && <span className="error-message">{errors.address.message}</span>}
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="form-step">
            <h3>Educación</h3>
            
            {educationFields.map((field: {id: string}, index: number) => (
              <div key={field.id} className="education-entry">
                <h4>Entrada de Educación {index + 1}</h4>
                
                <div className="form-group">
                  <label>Institución <span className="required-field">*</span></label>
                  <input
                    type="text"
                    placeholder="Nombre de la institución"
                    {...register(`education.${index}.institution` as const, {
                      required: 'La institución es obligatoria',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  {errors.education?.[index]?.institution && (
                    <span className="error-message">{errors.education[index]?.institution?.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Título <span className="required-field">*</span></label>
                  <input
                    type="text"
                    placeholder="Título obtenido"
                    {...register(`education.${index}.degree` as const, {
                      required: 'El título es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  {errors.education?.[index]?.degree && (
                    <span className="error-message">{errors.education[index]?.degree?.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Campo de Estudio <span className="required-field">*</span></label>
                  <input
                    type="text"
                    placeholder="Área de estudio"
                    {...register(`education.${index}.fieldOfStudy` as const, {
                      required: 'El campo de estudio es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  {errors.education?.[index]?.fieldOfStudy && (
                    <span className="error-message">{errors.education[index]?.fieldOfStudy?.message}</span>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio <span className="required-field">*</span></label>
                    <input
                      type="date"
                      {...register(`education.${index}.startDate` as const, {
                        required: 'La fecha de inicio es obligatoria',
                        onChange: () => {
                          setForceUpdate(prev => prev + 1);
                        }
                      })}
                    />
                    {errors.education?.[index]?.startDate && (
                      <span className="error-message">{errors.education[index]?.startDate?.message}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Fecha de Finalización <span className="required-field">*</span></label>
                    <input
                      type="date"
                      {...register(`education.${index}.endDate` as const, {
                        required: 'La fecha de finalización es obligatoria',
                        onChange: () => {
                          setForceUpdate(prev => prev + 1);
                        }
                      })}
                    />
                    {errors.education?.[index]?.endDate && (
                      <span className="error-message">{errors.education[index]?.endDate?.message}</span>
                    )}
                  </div>
                </div>
                
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => removeEducation(index)}
                    className="btn-remove"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendEducation({ 
                institution: '', 
                degree: '', 
                fieldOfStudy: '', 
                startDate: '', 
                endDate: '', 
                current: false 
              })}
              className="btn-add"
            >
              Añadir Otra Educación
            </button>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="form-step">
            <h3>Experiencia Laboral</h3>
            
            {workExperienceFields.map((field: {id: string}, index: number) => (
              <div key={field.id} className="work-experience-entry">
                <h4>Entrada de Experiencia {index + 1}</h4>
                
                <div className="form-group">
                  <label>Empresa <span className="required-field">*</span></label>
                  <input
                    type="text"
                    placeholder="Nombre de la empresa"
                    {...register(`workExperience.${index}.company` as const, {
                      required: 'La empresa es obligatoria',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  {errors.workExperience?.[index]?.company && (
                    <span className="error-message">{errors.workExperience[index]?.company?.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Posición <span className="required-field">*</span></label>
                  <input
                    type="text"
                    placeholder="Cargo o puesto"
                    {...register(`workExperience.${index}.position` as const, {
                      required: 'La posición es obligatoria',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  {errors.workExperience?.[index]?.position && (
                    <span className="error-message">{errors.workExperience[index]?.position?.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    placeholder="Describe tus responsabilidades y logros (opcional)"
                    {...register(`workExperience.${index}.description` as const)}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio <span className="required-field">*</span></label>
                    <input
                      type="date"
                      {...register(`workExperience.${index}.startDate` as const, {
                        required: 'La fecha de inicio es obligatoria',
                        onChange: () => {
                          setForceUpdate(prev => prev + 1);
                        }
                      })}
                    />
                    {errors.workExperience?.[index]?.startDate && (
                      <span className="error-message">{errors.workExperience[index]?.startDate?.message}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Fecha de Finalización <span className="required-field">*</span></label>
                    <input
                      type="date"
                      {...register(`workExperience.${index}.endDate` as const, {
                        required: 'La fecha de finalización es obligatoria',
                        onChange: () => {
                          setForceUpdate(prev => prev + 1);
                        }
                      })}
                    />
                    {errors.workExperience?.[index]?.endDate && (
                      <span className="error-message">{errors.workExperience[index]?.endDate?.message}</span>
                    )}
                  </div>
                </div>
                
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => removeWorkExperience(index)}
                    className="btn-remove"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => appendWorkExperience({ 
                company: '', 
                position: '', 
                description: '', 
                startDate: '', 
                endDate: '', 
                current: false 
              })}
              className="btn-add"
            >
              Añadir Otra Experiencia
            </button>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="form-step">
            <h3>Documentos y Notas</h3>
            
            <div className="form-group">
              <label>Curriculum Vitae (PDF o DOCX, máx. 2MB)</label>
              <Controller
                name="resume"
                control={control}
                render={({ field }: { field: any }) => (
                  <FileUpload
                    onChange={(file) => {
                      field.onChange(file);
                      setResumeFile(file);
                    }}
                    maxSize={2 * 1024 * 1024} // 2MB
                    acceptedTypes={['.pdf', '.docx']}
                  />
                )}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notas Adicionales</label>
              <textarea
                id="notes"
                {...register('notes')}
              />
            </div>
          </div>
        )}

        <div className="form-nav">
          {!isFirstStep && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleStepNavigation('prev')}
            >
              Anterior
            </button>
          )}
          
          {!isLastStep ? (
            <button 
              type="button" 
              className={`btn btn-primary ${!isStepValid() ? 'disabled' : ''}`}
              onClick={() => handleStepNavigation('next')}
              disabled={!isStepValid()}
            >
              Siguiente
            </button>
          ) : (
            <button 
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Guardar Candidato'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 