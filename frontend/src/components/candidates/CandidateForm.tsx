import React, { useState, useEffect } from 'react';
import FileUploadField from '../form/FileUploadField';
import EducationField from '../form/EducationField';
import WorkExperienceField from '../form/WorkExperienceField';
import SkillsField from '../form/SkillsField';
import Input from '../common/Input';
import FormField from '../common/FormField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { createCandidate, updateCandidate, getCandidateById } from '../../services/candidateService';
import { Education } from '../form/EducationField';
import { WorkExperience } from '../form/WorkExperienceField';

// Extender la interfaz Candidate para incluir los nuevos campos estructurados
interface ExtendedCandidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  education: Education[] | string | null;
  workExperience: WorkExperience[] | string | null;
  skills: string[];
  notes: string;
  cvUrl: string | null;
  cvFileName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CandidateFormProps {
  candidateId?: number;
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  notes: string;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ candidateId, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: [],
    workExperience: [],
    skills: [],
    notes: ''
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const isEditMode = !!candidateId;

  // Sugerencias para autocompletado
  const educationSuggestions = {
    institutions: ['Universidad Complutense de Madrid', 'Universidad Politécnica de Madrid', 'Universidad Autónoma de Madrid'],
    degrees: ['Grado en Ingeniería Informática', 'Máster en Ciencia de Datos', 'Doctorado en Inteligencia Artificial'],
    fieldsOfStudy: ['Informática', 'Ciencia de Datos', 'Inteligencia Artificial', 'Desarrollo de Software']
  };

  const workExperienceSuggestions = {
    companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook'],
    positions: ['Desarrollador Frontend', 'Desarrollador Backend', 'Desarrollador Full Stack', 'DevOps Engineer'],
    locations: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao']
  };

  const skillsSuggestions = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Python', 'Django', 'Flask',
    'Java', 'Spring Boot', 'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Rust',
    'HTML', 'CSS', 'SASS', 'LESS', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase', 'GraphQL', 'REST API',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
    'Jest', 'Mocha', 'Cypress', 'Selenium', 'Testing Library', 'Storybook', 'Webpack', 'Babel', 'ESLint',
    'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Trello', 'Notion', 'Figma', 'Adobe XD', 'Sketch'
  ];

  useEffect(() => {
    // Si estamos en modo edición, cargar los datos del candidato
    if (isEditMode) {
      const loadCandidate = async () => {
        try {
          setLoading(true);
          const candidate = await getCandidateById(candidateId);
          
          // Convertir los campos de educación y experiencia laboral
          let educationData: Education[] = [];
          let workExperienceData: WorkExperience[] = [];
          
          // Intentar parsear la educación como JSON si es una cadena
          if (typeof candidate.education === 'string' && candidate.education) {
            try {
              educationData = JSON.parse(candidate.education);
            } catch (e) {
              // Si no se puede parsear, crear un registro con la cadena como descripción
              educationData = [{
                id: generateId(),
                institution: 'Desconocido',
                degree: 'Desconocido',
                fieldOfStudy: 'Desconocido',
                startDate: '',
                endDate: '',
                isCurrentlyStudying: false,
                description: candidate.education || ''
              }];
            }
          }
          
          // Intentar parsear la experiencia laboral como JSON si es una cadena
          if (typeof candidate.workExperience === 'string' && candidate.workExperience) {
            try {
              workExperienceData = JSON.parse(candidate.workExperience);
            } catch (e) {
              // Si no se puede parsear, crear un registro con la cadena como descripción
              workExperienceData = [{
                id: generateId(),
                company: 'Desconocido',
                position: 'Desconocido',
                location: '',
                startDate: '',
                endDate: '',
                currentJob: false,
                description: candidate.workExperience || ''
              }];
            }
          }
          
          setFormData({
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone || '',
            address: candidate.address || '',
            education: educationData,
            workExperience: workExperienceData,
            skills: [], // Inicializar como array vacío
            notes: '' // Inicializar como cadena vacía
          });
          setLoading(false);
        } catch (err) {
          setError('Error al cargar los datos del candidato');
          setLoading(false);
        }
      };
      
      loadCandidate();
    }
  }, [candidateId, isEditMode]);

  // Generar un ID único
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es obligatorio';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es obligatorio';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El formato del email no es válido';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio';
    }
    
    if (!cvFile && !isEditMode) {
      errors.cv = 'El CV es obligatorio';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error de validación al editar el campo
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEducationChange = (education: Education[]) => {
    setFormData(prev => ({ ...prev, education }));
  };

  const handleWorkExperienceChange = (workExperience: WorkExperience[]) => {
    setFormData(prev => ({ ...prev, workExperience }));
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleFileChange = (file: File | null) => {
    setCvFile(file);
    
    // Limpiar error de validación
    if (validationErrors.cv) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cv;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Crear FormData para enviar datos y archivo
      const data = new FormData();
      
      // Añadir campos básicos
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('notes', formData.notes);
      
      // Añadir campos estructurados como JSON
      data.append('education', JSON.stringify(formData.education));
      data.append('workExperience', JSON.stringify(formData.workExperience));
      data.append('skills', JSON.stringify(formData.skills));
      
      // Añadir CV si existe
      if (cvFile) {
        data.append('cv', cvFile);
      }
      
      // Enviar datos al servidor
      if (isEditMode) {
        await updateCandidate(candidateId, data);
        setSuccess('Candidato actualizado correctamente');
      } else {
        await createCandidate(data);
        setSuccess('Candidato creado correctamente');
        
        // Resetear formulario
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          education: [],
          workExperience: [],
          skills: [],
          notes: ''
        });
        setCvFile(null);
      }
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error al guardar el candidato');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      
      {success && (
        <Alert
          type="success"
          title="Éxito"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              id="firstName"
              label="Nombre"
              required
              error={validationErrors.firstName}
            >
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={!!validationErrors.firstName}
                placeholder="Nombre"
              />
            </FormField>
            
            <FormField
              id="lastName"
              label="Apellidos"
              required
              error={validationErrors.lastName}
            >
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                error={!!validationErrors.lastName}
                placeholder="Apellidos"
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              id="email"
              label="Email"
              required
              error={validationErrors.email}
            >
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!validationErrors.email}
                placeholder="email@ejemplo.com"
              />
            </FormField>
            
            <FormField
              id="phone"
              label="Teléfono"
              required
              error={validationErrors.phone}
            >
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={!!validationErrors.phone}
                placeholder="+34 600 000 000"
              />
            </FormField>
          </div>
          
          <FormField
            id="address"
            label="Dirección"
          >
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección completa"
            />
          </FormField>
        </section>
        
        {/* Educación */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Educación</h2>
          <EducationField
            value={formData.education}
            onChange={handleEducationChange}
            suggestions={educationSuggestions}
            required
          />
        </section>
        
        {/* Experiencia Laboral */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Experiencia Laboral</h2>
          <WorkExperienceField
            value={formData.workExperience}
            onChange={handleWorkExperienceChange}
            suggestions={workExperienceSuggestions}
            required
          />
        </section>
        
        {/* Habilidades */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Habilidades</h2>
          <SkillsField
            value={formData.skills}
            onChange={handleSkillsChange}
            suggestions={skillsSuggestions}
            required={false}
            error={validationErrors.skills}
            label="Habilidades técnicas y profesionales"
          />
        </section>
        
        {/* Notas */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notas Adicionales</h2>
          <FormField
            id="notes"
            label="Notas"
          >
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-normal resize-y"
              placeholder="Información adicional sobre el candidato"
            />
          </FormField>
        </section>
        
        {/* Subida de CV */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Curriculum Vitae</h2>
          <FileUploadField
            value={cvFile}
            onChange={handleFileChange}
            label="CV (PDF o DOCX)"
            name="cv"
            id="cv-upload"
            acceptedFileTypes=".pdf,.doc,.docx"
            maxSizeMB={5}
            required={!isEditMode}
            error={validationErrors.cv}
            hint="Sube tu CV en formato PDF o DOCX (máximo 5MB)"
          />
        </section>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isEditMode ? 'Actualizar Candidato' : 'Añadir Candidato'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 