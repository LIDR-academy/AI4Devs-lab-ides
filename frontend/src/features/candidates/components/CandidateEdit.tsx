import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCandidateById, useUpdateCandidate } from '../hooks/useCandidates';
import { Candidate } from '../types';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const CandidateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const candidateId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCandidateById(candidateId);
  const updateMutation = useUpdateCandidate();
  
  const [formData, setFormData] = useState<Partial<Candidate>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    position: '',
    summary: '',
    experience: 0,
    educationText: '',
    notes: '',
    skills: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar los datos del candidato cuando estén disponibles
  useEffect(() => {
    if (data?.success && data.data) {
      setFormData({
        firstName: data.data.firstName || '',
        lastName: data.data.lastName || '',
        email: data.data.email || '',
        phone: data.data.phone || '',
        status: data.data.status || 'active',
        position: data.data.position || '',
        summary: data.data.summary || '',
        experience: data.data.experience || 0,
        educationText: data.data.educationText || '',
        notes: data.data.notes || '',
        skills: data.data.skills || []
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si el campo es experience, convertirlo a número
    if (name === 'experience') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Limpiar el error para este campo si existe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() === '') return;
    
    setFormData({
      ...formData,
      skills: [...(formData.skills || []), skillInput.trim()]
    });
    
    setSkillInput('');
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...(formData.skills || [])];
    updatedSkills.splice(index, 1);
    
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const response = await updateMutation.mutateAsync({
        id: candidateId,
        candidate: formData
      });
      
      if (response.success) {
        // Redirigir a la vista de detalle
        navigate(`/dashboard/candidates/${candidateId}`);
      } else {
        setSaveError(response.error || 'Error al guardar los cambios');
      }
    } catch (err: any) {
      console.error('Error al actualizar candidato:', err);
      setSaveError(err.message || 'Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackClick = () => {
    navigate(`/dashboard/candidates/${candidateId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !data?.success || !data.data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">No se pudo cargar la información del candidato.</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft className="mr-2" /> Volver a detalles
        </button>
        <h1 className="text-2xl font-bold">Editar Candidato</h1>
      </div>

      {/* Mensaje de error */}
      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{saveError}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Información personal */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Información personal</h2>
            
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Información profesional */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Información profesional</h2>
            
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="new">Nuevo</option>
                <option value="active">Activo</option>
                <option value="contacted">Contactado</option>
                <option value="interview">Entrevista</option>
                <option value="offer">Oferta</option>
                <option value="hired">Contratado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Posición
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experiencia (años)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="educationText" className="block text-sm font-medium text-gray-700 mb-1">
                Educación
              </label>
              <input
                type="text"
                id="educationText"
                name="educationText"
                value={formData.educationText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {/* Habilidades */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Habilidades</h2>
          
          <div className="flex mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
              placeholder="Añadir habilidad"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              Añadir
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.skills?.map((skill, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Resumen y notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Resumen
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleBackClick}
            className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            {isSaving ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Guardando...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateEdit; 