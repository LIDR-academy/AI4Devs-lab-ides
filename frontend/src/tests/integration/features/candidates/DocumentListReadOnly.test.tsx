import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DocumentListReadOnly from '../../../../features/candidates/components/DocumentListReadOnly';
import { candidateService } from '../../../../features/candidates/services/candidateService';
import api from '../../../../features/auth/services/authService';

// Mock de candidateService
jest.mock('../../../../features/candidates/services/candidateService', () => ({
  candidateService: {
    getCandidateDocuments: jest.fn(),
  },
}));

// Mock de authService
jest.mock('../../../../features/auth/services/authService', () => ({
  get: jest.fn(),
}));

describe('DocumentListReadOnly Component', () => {
  const candidateId = 1;
  const mockDocuments = [
    { 
      id: 1, 
      name: 'CV Juan', 
      type: 'CV', 
      fileType: 'pdf', 
      isEncrypted: false, 
      createdAt: '2023-01-01T00:00:00.000Z' 
    },
    { 
      id: 2, 
      name: 'Carta de Presentación', 
      type: 'Cover Letter', 
      fileType: 'docx', 
      isEncrypted: true, 
      createdAt: '2023-01-02T00:00:00.000Z' 
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup(); // Limpiar el DOM después de cada prueba
  });

  test('muestra mensaje de carga inicialmente', async () => {
    // Mock de getCandidateDocuments para que no resuelva inmediatamente
    (candidateService.getCandidateDocuments as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} />
      </MemoryRouter>
    );
    
    // Buscar un elemento que indique carga, como un div con clase animate-spin
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  test('muestra la lista de documentos después de cargar', async () => {
    // Mock de getCandidateDocuments para devolver documentos
    (candidateService.getCandidateDocuments as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockDocuments,
    });
    
    render(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} />
      </MemoryRouter>
    );
    
    // Esperar a que se carguen los documentos
    await waitFor(() => {
      expect(screen.getByText('CV Juan')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Carta de Presentación')).toBeInTheDocument();
    expect(screen.getByText('Encriptado')).toBeInTheDocument();
    expect(screen.getByText('Tipo: PDF')).toBeInTheDocument();
    expect(screen.getByText('Tipo: DOCX')).toBeInTheDocument();
  });
  
  test('muestra mensaje cuando no hay documentos', async () => {
    // Mock de getCandidateDocuments para devolver lista vacía
    (candidateService.getCandidateDocuments as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: [],
    });
    
    render(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} />
      </MemoryRouter>
    );
    
    // Esperar a que se muestre el mensaje
    await waitFor(() => {
      expect(screen.getByText(/No hay documentos asociados a este candidato/i)).toBeInTheDocument();
    });
  });
  
  test('muestra error cuando falla la carga de documentos', async () => {
    // Mock de getCandidateDocuments para devolver error
    (candidateService.getCandidateDocuments as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Error al obtener documentos',
    });
    
    render(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} />
      </MemoryRouter>
    );
    
    // Esperar a que se muestre el error
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Error al obtener documentos')).toBeInTheDocument();
  });

  test('verifica que el componente tiene botones de descarga', async () => {
    // Mock de getCandidateDocuments para devolver documentos
    (candidateService.getCandidateDocuments as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockDocuments,
    });
    
    render(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} />
      </MemoryRouter>
    );
    
    // Esperar a que se carguen los documentos
    await waitFor(() => {
      expect(screen.getByText('CV Juan')).toBeInTheDocument();
    });
    
    // Verificar que existen botones de descarga
    const downloadButtons = screen.getAllByText('Descargar');
    expect(downloadButtons.length).toBe(2); // Debe haber un botón por cada documento
  });

  test('verifica que refreshTrigger causa una nueva llamada a getCandidateDocuments', async () => {
    // Primera carga
    (candidateService.getCandidateDocuments as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockDocuments,
    });
    
    // Renderizar el componente con refreshTrigger=0
    const { rerender } = render(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} refreshTrigger={0} />
      </MemoryRouter>
    );
    
    // Esperar a que se complete la primera carga
    await waitFor(() => {
      expect(candidateService.getCandidateDocuments).toHaveBeenCalledTimes(1);
    });
    
    // Preparar el mock para la segunda carga
    (candidateService.getCandidateDocuments as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockDocuments,
    });
    
    // Volver a renderizar con refreshTrigger actualizado
    rerender(
      <MemoryRouter>
        <DocumentListReadOnly candidateId={candidateId} refreshTrigger={1} />
      </MemoryRouter>
    );
    
    // Verificar que se llamó a getCandidateDocuments una segunda vez
    await waitFor(() => {
      expect(candidateService.getCandidateDocuments).toHaveBeenCalledTimes(2);
    });
  });
}); 