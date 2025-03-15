import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import AddCandidate from '../AddCandidate';

// Mock de axios
jest.mock('axios');

// Mock de URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('AddCandidate Component', () => {
  // Configuración antes de cada prueba
  beforeEach(() => {
    // Limpiar mocks
    jest.clearAllMocks();
  });

  // Prueba: Renderizado inicial
  test('renders the form correctly', () => {
    render(<AddCandidate />);
    
    // Verificar elementos principales
    expect(screen.getByText('Añadir Nuevo Candidato')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/i)).toBeInTheDocument();
    expect(screen.getByText('Educación')).toBeInTheDocument();
    expect(screen.getByText('Experiencia Laboral')).toBeInTheDocument();
    expect(screen.getByText('Curriculum Vitae')).toBeInTheDocument();
    expect(screen.getByText(/Subir CV/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir Candidato/i })).toBeInTheDocument();
  });

  // Prueba: Validación de campos obligatorios
  test('validates required fields', async () => {
    render(<AddCandidate />);
    
    // Intentar enviar el formulario sin completar campos
    fireEvent.click(screen.getByRole('button', { name: /Añadir Candidato/i }));
    
    // Verificar mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El apellido es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El teléfono es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/La dirección es obligatoria/i)).toBeInTheDocument();
      expect(screen.getByText(/Por favor, sube el CV del candidato/i)).toBeInTheDocument();
    });
  });

  // Prueba: Validación de formato de email
  test('validates email format', async () => {
    render(<AddCandidate />);
    
    // Ingresar email inválido
    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Correo electrónico inválido/i)).toBeInTheDocument();
    });
    
    // Corregir email
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.blur(emailInput);
    
    // Verificar que el error desaparece
    await waitFor(() => {
      expect(screen.queryByText(/Correo electrónico inválido/i)).not.toBeInTheDocument();
    });
  });

  // Prueba: Validación de formato de teléfono
  test('validates phone format', async () => {
    render(<AddCandidate />);
    
    // Ingresar teléfono inválido
    const phoneInput = screen.getByLabelText(/Teléfono/i);
    fireEvent.change(phoneInput, { target: { value: 'abc' } });
    fireEvent.blur(phoneInput);
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Número de teléfono inválido/i)).toBeInTheDocument();
    });
    
    // Corregir teléfono
    fireEvent.change(phoneInput, { target: { value: '123456789' } });
    fireEvent.blur(phoneInput);
    
    // Verificar que el error desaparece
    await waitFor(() => {
      expect(screen.queryByText(/Número de teléfono inválido/i)).not.toBeInTheDocument();
    });
  });

  // Prueba: Añadir y eliminar campos de educación
  test('adds and removes education fields', async () => {
    render(<AddCandidate />);
    
    // Verificar campo inicial de educación
    expect(screen.getByLabelText(/Institución/i)).toBeInTheDocument();
    
    // Añadir campo de educación
    fireEvent.click(screen.getByRole('button', { name: /Añadir Educación/i }));
    
    // Verificar que hay dos campos de institución
    const institutionInputs = screen.getAllByLabelText(/Institución/i);
    expect(institutionInputs.length).toBe(2);
    
    // Eliminar el segundo campo
    const deleteButtons = screen.getAllByRole('button', { name: '' }); // Botones de eliminar no tienen texto
    fireEvent.click(deleteButtons[0]); // El primer botón de eliminar
    
    // Verificar que vuelve a haber un solo campo
    await waitFor(() => {
      const updatedInstitutionInputs = screen.getAllByLabelText(/Institución/i);
      expect(updatedInstitutionInputs.length).toBe(1);
    });
  });

  // Prueba: Añadir y eliminar campos de experiencia
  test('adds and removes experience fields', async () => {
    render(<AddCandidate />);
    
    // Verificar campo inicial de experiencia
    expect(screen.getByLabelText(/Empresa/i)).toBeInTheDocument();
    
    // Añadir campo de experiencia
    fireEvent.click(screen.getByRole('button', { name: /Añadir Experiencia/i }));
    
    // Verificar que hay dos campos de empresa
    const companyInputs = screen.getAllByLabelText(/Empresa/i);
    expect(companyInputs.length).toBe(2);
    
    // Eliminar el segundo campo
    const deleteButtons = screen.getAllByRole('button', { name: '' }); // Botones de eliminar no tienen texto
    fireEvent.click(deleteButtons[1]); // El segundo botón de eliminar (después de los de educación)
    
    // Verificar que vuelve a haber un solo campo
    await waitFor(() => {
      const updatedCompanyInputs = screen.getAllByLabelText(/Empresa/i);
      expect(updatedCompanyInputs.length).toBe(1);
    });
  });

  // Prueba: Validación de tipo de archivo
  test('validates file type', async () => {
    render(<AddCandidate />);
    
    // Crear archivo inválido
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    // Simular carga de archivo
    const fileInput = screen.getByLabelText(/Subir CV/i);
    await userEvent.upload(fileInput, invalidFile);
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Por favor, sube un archivo PDF o DOCX/i)).toBeInTheDocument();
    });
    
    // Crear archivo válido
    const validFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simular carga de archivo válido
    await userEvent.upload(fileInput, validFile);
    
    // Verificar que se muestra el nombre del archivo
    await waitFor(() => {
      expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
    });
  });

  // Prueba: Validación de tamaño de archivo
  test('validates file size', async () => {
    render(<AddCandidate />);
    
    // Crear archivo demasiado grande (6MB)
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    
    // Simular carga de archivo
    const fileInput = screen.getByLabelText(/Subir CV/i);
    await userEvent.upload(fileInput, largeFile);
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/El archivo es demasiado grande/i)).toBeInTheDocument();
    });
  });

  // Prueba: Envío exitoso del formulario
  test('submits the form successfully', async () => {
    // Mock de respuesta exitosa
    axios.post.mockResolvedValueOnce({
      data: {
        id: 1,
        success: true,
        message: 'Candidato añadido exitosamente',
      },
    });
    
    render(<AddCandidate />);
    
    // Completar formulario
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle Test 123' } });
    
    // Completar educación
    fireEvent.change(screen.getByLabelText(/Institución/i), { target: { value: 'Universidad Test' } });
    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Ingeniería' } });
    fireEvent.change(screen.getByLabelText(/Campo de Estudio/i), { target: { value: 'Informática' } });
    
    // Completar experiencia
    fireEvent.change(screen.getByLabelText(/Empresa/i), { target: { value: 'Empresa Test' } });
    fireEvent.change(screen.getByLabelText(/Cargo/i), { target: { value: 'Desarrollador' } });
    fireEvent.change(screen.getByLabelText(/Descripción/i), { target: { value: 'Desarrollo de software' } });
    
    // Cargar archivo
    const validFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Subir CV/i);
    await userEvent.upload(fileInput, validFile);
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /Añadir Candidato/i }));
    
    // Verificar que se llama a axios.post con los datos correctos
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      
      // Verificar que se envía un FormData
      const formDataArg = axios.post.mock.calls[0][1];
      expect(formDataArg instanceof FormData).toBe(true);
      
      // Verificar URL
      expect(axios.post.mock.calls[0][0]).toContain('/candidates');
    });
    
    // Verificar mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/Candidato añadido exitosamente/i)).toBeInTheDocument();
    });
  });

  // Prueba: Manejo de error en el envío
  test('handles submission error', async () => {
    // Mock de respuesta de error
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          success: false,
          message: 'Ya existe un candidato con este correo electrónico',
        },
      },
    });
    
    render(<AddCandidate />);
    
    // Completar formulario mínimo
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Calle Test 123' } });
    
    // Cargar archivo
    const validFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Subir CV/i);
    await userEvent.upload(fileInput, validFile);
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /Añadir Candidato/i }));
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Ya existe un candidato con este correo electrónico/i)).toBeInTheDocument();
    });
  });
}); 