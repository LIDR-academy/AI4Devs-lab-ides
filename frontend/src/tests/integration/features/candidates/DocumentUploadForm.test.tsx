import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DocumentUploadForm from '../../../../features/candidates/components/DocumentUploadForm';
import { candidateService } from '../../../../features/candidates/services/candidateService';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock de useAuth
jest.mock('../../../../features/auth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

// Mock de candidateService
jest.mock('../../../../features/candidates/services/candidateService', () => ({
  candidateService: {
    uploadDocument: jest.fn(),
  },
}));

describe('DocumentUploadForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();
  const candidateId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario correctamente', () => {
    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Subir Documento')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del documento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de documento/i)).toBeInTheDocument();
    expect(screen.getByText(/Encriptar documento/i)).toBeInTheDocument();
    expect(screen.getByText(/Seleccionar archivo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
  });

  test('muestra error cuando no se selecciona un archivo', async () => {
    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    // Completar el formulario sin seleccionar un archivo
    fireEvent.change(screen.getByLabelText(/Nombre del documento/i), {
      target: { value: 'Mi CV' },
    });

    // Enviar el formulario
    const submitButton = screen.getByRole('button', { name: /Subir/i }) as HTMLButtonElement;
    // Habilitar el botón (ya que está deshabilitado por defecto)
    submitButton.disabled = false;
    fireEvent.click(submitButton);

    // Verificar que se muestra el error
    await waitFor(() => {
      const errorElement = screen.getByText(/seleccione un archivo/i);
      expect(errorElement).toBeInTheDocument();
    });
  });

  test('valida el tipo de archivo', async () => {
    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    // Crear un archivo con tipo no permitido
    const file = new File(['contenido'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/Seleccionar archivo/i);

    // Simular la selección del archivo
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verificar que se muestra el error de tipo de archivo
    await waitFor(() => {
      expect(screen.getByText(/Tipo de archivo no permitido/i)).toBeInTheDocument();
    });
  });

  test('valida el tamaño del archivo', async () => {
    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    // Crear un archivo grande (simulado)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Seleccionar archivo/i);

    // Simular la selección del archivo
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    // Verificar que se muestra el error de tamaño
    await waitFor(() => {
      expect(screen.getByText(/El archivo excede el tamaño máximo permitido/i)).toBeInTheDocument();
    });
  });

  test('permite subir un archivo válido', async () => {
    // Mock de respuesta exitosa
    (candidateService.uploadDocument as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Mi CV.pdf' },
    });

    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/Nombre del documento/i), {
      target: { value: 'Mi CV' },
    });

    // Seleccionar un archivo válido
    const file = new File(['contenido'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Seleccionar archivo/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Enviar el formulario
    const submitButton = screen.getByRole('button', { name: /Subir/i }) as HTMLButtonElement;
    // Habilitar el botón (ya que está deshabilitado por defecto)
    submitButton.disabled = false;
    fireEvent.click(submitButton);

    // Verificar que se llamó al servicio con los parámetros correctos
    await waitFor(() => {
      expect(candidateService.uploadDocument).toHaveBeenCalledWith(
        candidateId,
        expect.any(FormData)
      );
    });

    // Verificar que se muestra el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/Documento subido correctamente/i)).toBeInTheDocument();
    });

    // Verificar que se llamó a onSuccess después del tiempo de espera
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  test('maneja errores durante la carga', async () => {
    // Mock de respuesta con error
    (candidateService.uploadDocument as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Error al subir el documento',
    });

    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/Nombre del documento/i), {
      target: { value: 'Mi CV' },
    });

    // Seleccionar un archivo válido
    const file = new File(['contenido'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Seleccionar archivo/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Enviar el formulario
    const submitButton = screen.getByRole('button', { name: /Subir/i }) as HTMLButtonElement;
    // Habilitar el botón (ya que está deshabilitado por defecto)
    submitButton.disabled = false;
    fireEvent.click(submitButton);

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Error al subir el documento/i)).toBeInTheDocument();
    });

    // Verificar que no se llamó a onSuccess
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('llama a onCancel cuando se hace clic en el botón Cancelar', () => {
    render(
      <MemoryRouter>
        <DocumentUploadForm
          candidateId={candidateId}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      </MemoryRouter>
    );

    // Hacer clic en el botón Cancelar
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    // Verificar que se llamó a onCancel
    expect(mockOnCancel).toHaveBeenCalled();
  });
}); 