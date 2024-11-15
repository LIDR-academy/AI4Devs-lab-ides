import React, { useState } from 'react';
import './AddCandidateForm.css';

const AddCandidateForm: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors((prevErrors) => ({ ...prevErrors, cv: 'Solo se permiten archivos PDF o DOCX' }));
        setCv(null);
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, cv: 'El archivo no debe superar los 5 MB' }));
        setCv(null);
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, cv: '' }));
        setCv(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'El nombre es obligatorio';
    if (!lastName) newErrors.lastName = 'El apellido es obligatorio';
    if (!email || !validateEmail(email)) newErrors.email = 'Correo electrónico no válido';
    if (!phone) newErrors.phone = 'El teléfono es obligatorio';
    if (!address) newErrors.address = 'La dirección es obligatoria';
    if (!education) newErrors.education = 'La educación es obligatoria';
    if (!experience) newErrors.experience = 'La experiencia es obligatoria';
    if (!cv) newErrors.cv = 'El CV es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('education', education);
      formData.append('experience', experience);
      if (cv) {
        formData.append('cv', cv);
      }

      try {
        const response = await fetch('http://localhost:3010/api/candidates', {
          method: 'POST',
          body: formData,
        });
        console.log('🚀 ~ handleSubmit ~ response:', response);

        if (response.ok) {
          setSubmitStatus({
            success: true,
            message: '¡Candidato añadido exitosamente!'
          });
          // Clear form
          setName('');
          setLastName('');
          setEmail('');
          setPhone('');
          setAddress('');
          setEducation('');
          setExperience('');
          setCv(null);
          setErrors({});
        } else {
          setSubmitStatus({
            success: false,
            message: 'Error al añadir el candidato. Por favor, intente nuevamente.'
          });
        }
      } catch (error) {
        setSubmitStatus({
          success: false,
          message: 'Error de conexión. Por favor, verifique su conexión a internet.'
        });
      }
    }
  };

  return (
    <div>
      <h2>Formulario de Inscripción de Candidato</h2>
      {submitStatus && (
        <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div>
          <label htmlFor="address">Dirección:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <div>
          <label htmlFor="education">Educación:</label>
          <input
            type="text"
            id="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
          {errors.education && <span className="error">{errors.education}</span>}
        </div>
        <div>
          <label htmlFor="experience">Experiencia:</label>
          <input
            type="text"
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          {errors.experience && <span className="error">{errors.experience}</span>}
        </div>
        <div>
          <label htmlFor="cv">Cargar CV (PDF o DOCX, máx. 5MB):</label>
          <input
            type="file"
            id="cv"
            accept=".pdf, .docx"
            onChange={handleFileChange}
          />
          {errors.cv && <span className="error">{errors.cv}</span>}
        </div>
        <button type="submit">Guardar Candidato</button>
      </form>
    </div>
  );
};

export default AddCandidateForm;