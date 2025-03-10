import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DocumentUpload from '../../../../components/candidates/DocumentUpload';
import { toast } from 'react-toastify';

// Mock de fetch global
global.fetch = jest.fn();

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DocumentUpload Component', () => {
  const candidateId = 1;
  const mockOnUploadSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario correctamente', () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Usar getByRole para encontrar el encabezado
    expect(screen.getByRole('heading', { name: 'Subir Documento' })).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('type-select')).toBeInTheDocument();
    expect(screen.getByLabelText(/Encriptar documento/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subir Documento/i })).toBeInTheDocument();
  });

  test('muestra error cuando no se selecciona un archivo', async () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Completar el nombre del documento
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Mi CV' },
    });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que se muestra el error
    expect(toast.error).toHaveBeenCalledWith('Por favor seleccione un archivo');
  });

  test('muestra error cuando no se ingresa un nombre', async () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo
    const file = new File(['contenido'], 'test.pdf', { type: 'application/pdf' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Borrar el nombre (que se auto-completa)
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: '' },
    });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que se muestra el error
    expect(toast.error).toHaveBeenCalledWith('Por favor ingrese un nombre para el documento');
  });

  test('muestra error cuando el tipo de archivo no es soportado', async () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo con tipo no soportado
    const file = new File(['contenido'], 'test.jpg', { type: 'image/jpeg' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que se muestra el error
    expect(toast.error).toHaveBeenCalledWith('Tipo de archivo no soportado. Solo se permiten PDF, DOC, DOCX y TXT');
  });

  test('auto-completa el nombre del documento con el nombre del archivo', () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo
    const file = new File(['contenido'], 'curriculum-vitae.pdf', { type: 'application/pdf' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verificar que el nombre se auto-completó
    expect(screen.getByTestId('name-input')).toHaveValue('curriculum-vitae');
  });

  test('sube un documento correctamente', async () => {
    // Mock de fetch para simular una respuesta exitosa
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 1, name: 'Mi CV' } }),
    });

    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo
    const file = new File(['contenido'], 'curriculum-vitae.pdf', { type: 'application/pdf' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que se llamó a fetch con los parámetros correctos
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3010/api/candidates/${candidateId}/documents`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          credentials: 'include',
        })
      );
    });

    // Verificar que se mostró el mensaje de éxito
    expect(toast.success).toHaveBeenCalledWith('Documento subido exitosamente');
    
    // Verificar que se llamó a onUploadSuccess
    expect(mockOnUploadSuccess).toHaveBeenCalled();
  });

  test('maneja errores durante la carga', async () => {
    // Mock de console.error para evitar mensajes en la consola durante las pruebas
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock de fetch para simular un error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Error al subir el documento' } }),
    });

    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo
    const file = new File(['contenido'], 'curriculum-vitae.pdf', { type: 'application/pdf' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que se mostró el mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al subir el documento');
    });
    
    // Verificar que no se llamó a onUploadSuccess
    expect(mockOnUploadSuccess).not.toHaveBeenCalled();
  });

  test('maneja excepciones durante la carga', async () => {
    // Mock de console.error para evitar mensajes en la consola durante las pruebas
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock de fetch para lanzar una excepción
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error de red'));

    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo
    const file = new File(['contenido'], 'curriculum-vitae.pdf', { type: 'application/pdf' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que se mostró el mensaje de error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error de red');
    });
    
    // Verificar que no se llamó a onUploadSuccess
    expect(mockOnUploadSuccess).not.toHaveBeenCalled();
  });

  test('muestra el tamaño del archivo seleccionado', () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Crear un archivo de 1024 bytes
    const file = new File(['x'.repeat(1024)], 'curriculum-vitae.pdf', { type: 'application/pdf' });
    
    // Seleccionar el archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verificar que se muestra el tamaño del archivo
    expect(screen.getByText(/Archivo seleccionado: curriculum-vitae.pdf \(1.00 KB\)/i)).toBeInTheDocument();
  });

  test('permite cambiar el tipo de documento', () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Cambiar el tipo de documento
    const selectElement = screen.getByTestId('type-select');
    fireEvent.change(selectElement, { target: { value: 'Cover Letter' } });

    // Verificar que se cambió el tipo
    expect(selectElement).toHaveValue('Cover Letter');
  });

  test('permite desactivar la encriptación', () => {
    render(
      <MemoryRouter>
        <DocumentUpload candidateId={candidateId} onUploadSuccess={mockOnUploadSuccess} />
      </MemoryRouter>
    );

    // Por defecto, la encriptación está activada
    const checkbox = screen.getByLabelText(/Encriptar documento/i);
    expect(checkbox).toBeChecked();

    // Desactivar la encriptación
    fireEvent.click(checkbox);

    // Verificar que se desactivó
    expect(checkbox).not.toBeChecked();
  });
}); 