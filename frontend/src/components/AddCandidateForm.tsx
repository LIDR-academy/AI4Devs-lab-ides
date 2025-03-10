import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';
import Confetti from 'react-confetti';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

interface CandidateFormInputs {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  education: string;
  work_experience: string;
  cv?: FileList;
}

const AddCandidateForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm<CandidateFormInputs>();
  const [message, setMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchMedia.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    matchMedia.addEventListener('change', handleChange);
    return () => matchMedia.removeEventListener('change', handleChange);
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file.name.match(/\.(pdf|docx)$/)) {
      setError('cv', {
        type: 'manual',
        message: 'El archivo CV debe ser en formato PDF o DOCX.',
      });
      return;
    }
    setFile(file);
    clearErrors('cv');
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
  });

  const onSubmit = async (data: CandidateFormInputs) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone_number', phoneNumber);
    formData.append('address', data.address);
    formData.append('education', data.education);
    formData.append('work_experience', data.work_experience);
    if (file) {
      formData.append('cv', file);
    }

    try {
      const response = await fetch('http://localhost:3010/api/candidates', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Candidato creado exitosamente.');
        toast.success('Candidato creado exitosamente.');
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        if (errorData.error.includes('correo electrónico ya existe')) {
          setMessage('El correo electrónico ya está registrado. Por favor, utiliza otro correo electrónico.');
          toast.error('El correo electrónico ya está registrado. Por favor, utiliza otro correo electrónico.');
        } else {
          setMessage(`Error: ${errorData.error}`);
          toast.error(`Error: ${errorData.error}`);
        }
      }
    } catch (error) {
      setMessage('Error al crear el candidato.');
      toast.error('Error al crear el candidato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewCandidate = () => {
    reset();
    setFile(null);
    setIsSuccess(false);
    setMessage(null);
    setPhoneNumber('');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {isSuccess && <Confetti />}
      <ToastContainer />
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
          <div className="relative">
            <input
              {...register('first_name', { required: 'El nombre es obligatorio' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.first_name ? 'border-red-500' : ''}`}
            />
            {errors.first_name && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          {errors.first_name && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.first_name.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellido</label>
          <div className="relative">
            <input
              {...register('last_name', { required: 'El apellido es obligatorio' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.last_name ? 'border-red-500' : ''}`}
            />
            {errors.last_name && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          {errors.last_name && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.last_name.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
          <div className="relative">
            <input
              {...register('email', { required: 'El correo electrónico es obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'El correo electrónico no es válido' } })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          {errors.email && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Teléfono</label>
          <div className="relative">
            <PhoneInput
              country={'es'} // Establecer el prefijo por defecto a España
              value={phoneNumber}
              placeholder="+34 910 000 000"
              onChange={(phone) => {
                setPhoneNumber(phone);
                const parsedPhone = parsePhoneNumberFromString(phone, 'ES');
                if (parsedPhone && parsedPhone.isValid()) {
                  clearErrors('phone_number');
                } else {
                  setError('phone_number', {
                    type: 'manual',
                    message: 'El número de teléfono no es válido',
                  });
                }
              }}
              inputStyle={{
                width: '100%',
                borderRadius: '0.375rem',
                borderColor: errors.phone_number ? '#f87171' : '#d1d5db',
                padding: '0.5rem 0.5rem 0.5rem 3.5rem', // Ajustar padding para separar los números del prefijo
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#d1d5db' : '#000000',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                border: 'none'
              }}
              containerStyle={{
                width: '100%',
                borderRadius: '0.375rem',
                borderColor: errors.phone_number ? '#f87171' : '#d1d5db',
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#d1d5db' : '#000000',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              buttonStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                color: isDarkMode ? '#d1d5db' : '#000000',
                border: 'none'
              }}
              dropdownStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                color: isDarkMode ? '#d1d5db' : '#000000',
              }}
            />
            {errors.phone_number && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
            {!errors.phone_number && phoneNumber && isValidPhoneNumber(phoneNumber) && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </div>
          {errors.phone_number && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.phone_number.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dirección</label>
          <div className="relative">
            <input
              {...register('address', { required: 'La dirección es obligatoria' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          {errors.address && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.address.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Educación</label>
          <div className="relative">
            <input
              {...register('education', { required: 'La educación es obligatoria' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.education ? 'border-red-500' : ''}`}
            />
            {errors.education && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          {errors.education && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.education.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experiencia Laboral</label>
          <div className="relative">
            <input
              {...register('work_experience', { required: 'La experiencia laboral es obligatoria' })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.work_experience ? 'border-red-500' : ''}`}
            />
            {errors.work_experience && (
              <motion.div
                className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
          </div>
          {errors.work_experience && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.work_experience.message}
            </motion.p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV (PDF o DOCX)</label>
          <div
            {...getRootProps()}
            className={`mt-1 flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 ${errors.cv ? 'border-red-500' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p>{file.name}</p>
            ) : (
              <p>Arrastra y suelta el archivo aquí, o haz clic para seleccionar uno</p>
            )}
          </div>
          {errors.cv && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {errors.cv.message}
            </motion.p>
          )}
        </div>
        <motion.button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting || isSuccess}
        >
          Añadir Candidato
        </motion.button>
        {isSuccess && (
          <motion.button
            type="button"
            className="w-full py-3 px-4 mt-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewCandidate}
          >
            Nuevo Candidato
          </motion.button>
        )}
      </motion.form>
    </div>
  );
};

export default AddCandidateForm;