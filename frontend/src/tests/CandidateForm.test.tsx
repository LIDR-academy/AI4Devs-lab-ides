import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CandidateForm from '../components/candidates/CandidateForm';
import * as candidateService from '../services/candidateService';

// Mock del servicio de candidatos
jest.mock('../services/candidateService');

describe('CandidateForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario con todos los campos requeridos y opcionales', () => {
    render(<CandidateForm />);
    
    // Campos obligatorios
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    
    // Campos opcionales
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    
    // Secciones de educación y experiencia laboral
    expect(screen.getByText(/educación/i)).toBeInTheDocument();
    expect(screen.getByText(/experiencia laboral/i)).toBeInTheDocument();
    
    // Botón para subir CV
    expect(screen.getByText(/cv/i)).toBeInTheDocument();
    
    // Botón de envío
    expect(screen.getByRole('button', { name: /añadir candidato/i })).toBeInTheDocument();
  });

  test('muestra errores cuando se envía el formulario con campos requeridos vacíos', async () => {
    render(<CandidateForm />);
    
    // Enviar formulario sin completar campos
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/debe añadir al menos un registro de educación/i)).toBeInTheDocument();
      expect(screen.getByText(/debe añadir al menos un registro de experiencia laboral/i)).toBeInTheDocument();
      expect(screen.getByText(/debe subir un cv/i)).toBeInTheDocument();
    });
    
    // Verificar que no se llamó al servicio
    expect(candidateService.createCandidate).not.toHaveBeenCalled();
  });

  test('valida el formato de email', async () => {
    render(<CandidateForm />);
    
    // Completar campos
    userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    userEvent.type(screen.getByLabelText(/email/i), 'correo-invalido');
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/el formato del email no es válido/i)).toBeInTheDocument();
    });
    
    // Verificar que no se llamó al servicio
    expect(candidateService.createCandidate).not.toHaveBeenCalled();
  });

  test('envía el formulario correctamente con datos válidos', async () => {
    // Mock de la respuesta del servicio
    (candidateService.createCandidate as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34600000000'
    });
    
    render(<CandidateForm />);
    
    // Completar campos obligatorios
    userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    userEvent.type(screen.getByLabelText(/email/i), 'juan.perez@example.com');
    userEvent.type(screen.getByLabelText(/teléfono/i), '+34600000000');
    
    // Añadir educación
    fireEvent.click(screen.getByText(/añadir educación/i));
    userEvent.type(screen.getByLabelText(/institución/i), 'Universidad Complutense');
    userEvent.type(screen.getByLabelText(/título/i), 'Ingeniería Informática');
    userEvent.type(screen.getByLabelText(/campo de estudio/i), 'Informática');
    
    // Añadir experiencia laboral
    fireEvent.click(screen.getByText(/añadir experiencia/i));
    userEvent.type(screen.getByLabelText(/empresa/i), 'Tech Solutions');
    userEvent.type(screen.getByLabelText(/puesto/i), 'Desarrollador Full Stack');
    
    // Simular carga de CV
    const file = new File(['dummy content'], 'cv.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/cv/i);
    userEvent.upload(fileInput, file);
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que se llamó al servicio con los datos correctos
    await waitFor(() => {
      expect(candidateService.createCandidate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '+34600000000',
          education: expect.arrayContaining([
            expect.objectContaining({
              institution: 'Universidad Complutense',
              degree: 'Ingeniería Informática',
              fieldOfStudy: 'Informática'
            })
          ]),
          workExperience: expect.arrayContaining([
            expect.objectContaining({
              company: 'Tech Solutions',
              position: 'Desarrollador Full Stack'
            })
          ])
        }),
        file
      );
    });
    
    // Verificar mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/candidato añadido correctamente/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje de error cuando falla la creación del candidato', async () => {
    // Mock de error en el servicio
    (candidateService.createCandidate as jest.Mock).mockRejectedValue(new Error('Error al crear candidato'));
    
    render(<CandidateForm />);
    
    // Completar campos obligatorios
    userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    userEvent.type(screen.getByLabelText(/email/i), 'juan.perez@example.com');
    userEvent.type(screen.getByLabelText(/teléfono/i), '+34600000000');
    
    // Añadir educación
    fireEvent.click(screen.getByText(/añadir educación/i));
    userEvent.type(screen.getByLabelText(/institución/i), 'Universidad Complutense');
    userEvent.type(screen.getByLabelText(/título/i), 'Ingeniería Informática');
    userEvent.type(screen.getByLabelText(/campo de estudio/i), 'Informática');
    
    // Añadir experiencia laboral
    fireEvent.click(screen.getByText(/añadir experiencia/i));
    userEvent.type(screen.getByLabelText(/empresa/i), 'Tech Solutions');
    userEvent.type(screen.getByLabelText(/puesto/i), 'Desarrollador Full Stack');
    
    // Simular carga de CV
    const file = new File(['dummy content'], 'cv.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/cv/i);
    userEvent.upload(fileInput, file);
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/error al crear candidato/i)).toBeInTheDocument();
    });
  });

  test('limpia el formulario después de un envío exitoso', async () => {
    // Mock de la respuesta del servicio
    (candidateService.createCandidate as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34600000000'
    });
    
    render(<CandidateForm />);
    
    // Completar campos
    userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    userEvent.type(screen.getByLabelText(/email/i), 'juan.perez@example.com');
    userEvent.type(screen.getByLabelText(/teléfono/i), '+34600000000');
    
    // Añadir educación y experiencia
    fireEvent.click(screen.getByText(/añadir educación/i));
    fireEvent.click(screen.getByText(/añadir experiencia/i));
    
    // Simular carga de CV
    const file = new File(['dummy content'], 'cv.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/cv/i);
    userEvent.upload(fileInput, file);
    
    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /añadir candidato/i }));
    
    // Verificar que el formulario se limpió
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/teléfono/i)).toHaveValue('');
    });
  });

  test('carga datos del candidato en modo edición', async () => {
    // Mock de datos del candidato
    const candidateData = {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '+34600000000',
      address: 'Calle Principal 123',
      education: [
        {
          id: 1,
          institution: 'Universidad Complutense',
          degree: 'Ingeniería Informática',
          fieldOfStudy: 'Informática',
          startDate: '2015-09-01',
          endDate: '2019-06-30',
          description: 'Especialización en IA'
        }
      ],
      workExperience: [
        {
          id: 1,
          company: 'Tech Solutions',
          position: 'Desarrollador Full Stack',
          startDate: '2019-07-01',
          endDate: null,
          description: 'Desarrollo de aplicaciones web'
        }
      ]
    };
    
    // Mock del servicio para obtener candidato
    (candidateService.getCandidateById as jest.Mock).mockResolvedValue(candidateData);
    
    // Renderizar en modo edición
    render(<CandidateForm candidateId={1} />);
    
    // Verificar que se cargan los datos
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('Juan');
      expect(screen.getByLabelText(/apellido/i)).toHaveValue('Pérez');
      expect(screen.getByLabelText(/email/i)).toHaveValue('juan.perez@example.com');
      expect(screen.getByLabelText(/teléfono/i)).toHaveValue('+34600000000');
      expect(screen.getByLabelText(/dirección/i)).toHaveValue('Calle Principal 123');
      
      // Verificar educación
      expect(screen.getByDisplayValue('Universidad Complutense')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Ingeniería Informática')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Informática')).toBeInTheDocument();
      
      // Verificar experiencia laboral
      expect(screen.getByDisplayValue('Tech Solutions')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Desarrollador Full Stack')).toBeInTheDocument();
    });
  });
}); 