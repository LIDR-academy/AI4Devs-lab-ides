import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecluterDashboard: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        educacion: '',
        experiencia: '',
        cv: null as File | null
    });

    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        educacion: '',
        experiencia: '',
        cv: ''
    });

    const validateEmail = (email: string) => {
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleAddCandidateClick = () => {
        setShowForm(!showForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                setFormData({ ...formData, cv: file });
                setErrors({ ...errors, cv: '' });
            } else {
                setErrors({ ...errors, cv: 'Formato de archivo no soportado. Solo se permiten PDF o DOCX.' });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let valid = true;
        let newErrors = { ...errors };

        // Validations
        if (!formData.nombre) {
            newErrors.nombre = 'El nombre es obligatorio';
            valid = false;
        } else {
            newErrors.nombre = '';
        }

        if (!formData.apellido) {
            newErrors.apellido = 'El apellido es obligatorio';
            valid = false;
        } else {
            newErrors.apellido = '';
        }

        if (!formData.email || !validateEmail(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
            valid = false;
        } else {
            newErrors.email = '';
        }

        if (!formData.telefono) {
            newErrors.telefono = 'El teléfono es obligatorio';
            valid = false;
        } else {
            newErrors.telefono = '';
        }

        if (!formData.direccion) {
            newErrors.direccion = 'La dirección es obligatoria';
            valid = false;
        } else {
            newErrors.direccion = '';
        }

        if (!formData.educacion) {
            newErrors.educacion = 'La educación es obligatoria';
            valid = false;
        } else {
            newErrors.educacion = '';
        }

        if (!formData.experiencia) {
            newErrors.experiencia = 'La experiencia laboral es obligatoria';
            valid = false;
        } else {
            newErrors.experiencia = '';
        }

        if (!formData.cv) {
            newErrors.cv = 'El CV es obligatorio';
            valid = false;
        } else {
            newErrors.cv = '';
        }

        setErrors(newErrors);

        if (valid) {
            // Aquí puedes manejar el envío del formulario
            console.log('Formulario enviado', formData);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Recluter Dashboard</h1>
            <button className="btn btn-primary" onClick={handleAddCandidateClick}>Agregar Candidato</button>
            {showForm && (
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" className="form-control" id="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
                        {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido</label>
                        <input type="text" className="form-control" id="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} />
                        {errors.apellido && <small className="text-danger">{errors.apellido}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" className="form-control" id="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleInputChange} />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input type="tel" className="form-control" id="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
                        {errors.telefono && <small className="text-danger">{errors.telefono}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input type="text" className="form-control" id="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} />
                        {errors.direccion && <small className="text-danger">{errors.direccion}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="educacion">Educación</label>
                        <input type="text" className="form-control" id="educacion" placeholder="Educación" value={formData.educacion} onChange={handleInputChange} />
                        {errors.educacion && <small className="text-danger">{errors.educacion}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="experiencia">Experiencia Laboral</label>
                        <textarea className="form-control" id="experiencia" placeholder="Experiencia Laboral" value={formData.experiencia} onChange={handleInputChange}></textarea>
                        {errors.experiencia && <small className="text-danger">{errors.experiencia}</small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cv">Cargar CV</label>
                        <input type="file" className="form-control-file" id="cv" onChange={handleFileChange} />
                        {errors.cv && <small className="text-danger">{errors.cv}</small>}
                    </div>
                    <button type="submit" className="btn btn-success mt-3">Guardar</button>
                </form>
            )}
        </div>
    );
};

export default RecluterDashboard; 