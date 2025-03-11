import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DocumentList from '../../../../components/candidates/DocumentList';

// Mock de fetch global
global.fetch = jest.fn();

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DocumentList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra mensaje de carga inicialmente', async () => {
    // Mock de fetch para que no resuelva inmediatamente
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <DocumentList candidateId={1} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Cargando documentos/i)).toBeInTheDocument();
  });
  
  test('muestra la lista de documentos después de cargar', async () => {
    // Mock de fetch para devolver documentos
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, name: 'CV.pdf', type: 'CV', fileType: 'pdf', isEncrypted: false, createdAt: '2023-01-01T00:00:00.000Z' },
          { id: 2, name: 'Carta.docx', type: 'Cover Letter', fileType: 'docx', isEncrypted: true, createdAt: '2023-01-02T00:00:00.000Z' },
        ]
      }),
    });
    
    render(
      <MemoryRouter>
        <DocumentList candidateId={1} />
      </MemoryRouter>
    );
    
    // Esperar a que se carguen los documentos
    await waitFor(() => {
      expect(screen.getByText('CV.pdf')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Carta.docx')).toBeInTheDocument();
  });
  
  test('muestra mensaje cuando no hay documentos', async () => {
    // Mock de fetch para devolver lista vacía
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });
    
    render(
      <MemoryRouter>
        <DocumentList candidateId={1} />
      </MemoryRouter>
    );
    
    // Esperar a que se muestre el mensaje
    await waitFor(() => {
      expect(screen.getByText(/No hay documentos disponibles/i)).toBeInTheDocument();
    });
  });
  
  test('muestra error cuando falla la carga de documentos', async () => {
    // Mock de fetch para devolver error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Error al obtener documentos' } }),
    });
    
    render(
      <MemoryRouter>
        <DocumentList candidateId={1} />
      </MemoryRouter>
    );
    
    // Esperar a que se muestre el error
    await waitFor(() => {
      expect(screen.getByText(/Error al obtener documentos/i)).toBeInTheDocument();
    });
  });
}); 