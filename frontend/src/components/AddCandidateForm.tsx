// src/components/AddCandidateForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  firstName: z.string().nonempty("El nombre es obligatorio"),
  lastName: z.string().nonempty("El apellido es obligatorio"),
  email: z.string().email("Correo electrónico no válido"),
  phone: z.string().nonempty("El teléfono es obligatorio"),
  address: z.string().nonempty("La dirección es obligatoria"),
  education: z.string().nonempty("La educación es obligatoria"),
  experience: z.string().nonempty("La experiencia es obligatoria"),
  resume: z.any()
});

type FormData = z.infer<typeof schema>;

const AddCandidateForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('education', data.education);
    formData.append('experience', data.experience);

    const resume = (data.resume[0] as unknown) as File;
    if (resume.size > 10 * 1024 * 1024) {
      setMessage('El archivo no debe superar los 10MB.');
      return;
    }
    const allowedExtensions = ['pdf', 'docx'];
    const fileExtension = resume.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension || '')) {
      setMessage('Formato de archivo no permitido. Solo se permiten PDF y DOCX.');
      return;
    }

    formData.append('resume', resume);

    try {
      const response = await axios.post('http://localhost:3010/api/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Candidato añadido exitosamente');
    } catch (error) {
      setMessage('Error al añadir el candidato');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Añadir Candidato</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            {...register('firstName')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Apellido</label>
          <input
            type="text"
            {...register('lastName')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Teléfono</label>
          <input
            type="text"
            {...register('phone')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Dirección</label>
          <input
            type="text"
            {...register('address')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Educación</label>
          <input
            type="text"
            {...register('education')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.education && <p className="text-red-500">{errors.education.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Experiencia</label>
          <input
            type="text"
            {...register('experience')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.experience && <p className="text-red-500">{errors.experience.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">CV</label>
          <input
            type="file"
            {...register('resume')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.resume && <p className="text-red-500">{errors.resume.message?.toString()}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Añadir Candidato</button>
      </form>
    </div>
  );
};

export default AddCandidateForm;
