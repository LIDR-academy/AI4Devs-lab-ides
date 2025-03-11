import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CandidateDocumentsPage from '../../../pages/CandidateDocumentsPage';
import { ToastContainer } from 'react-toastify';

// Mock de los componentes utilizados
jest.mock('../../../components/candidates/DocumentUpload', () => ({
  __esModule: true,
  default: ({ candidateId, onUploadSuccess }: { candidateId: number, onUploadSuccess: () => void }) => (
    <div data-testid="document-upload">
      <span>DocumentUpload Mock</span>
      <span>CandidateId: {candidateId}</span>
      <button onClick={onUploadSuccess}>Simular Upload Success</button>
    </div>
  ),
}));

jest.mock('../../../components/candidates/DocumentList', () => ({
  __esModule: true,
  default: ({ candidateId, refreshTrigger }: { candidateId: number, refreshTrigger: number }) => (
    <div data-testid="document-list">
      <span>DocumentList Mock</span>
      <span>CandidateId: {candidateId}</span>
      <span data-testid="refresh-trigger">RefreshTrigger: {refreshTrigger}</span>
    </div>
  ),
}));

// Mock de react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container">Toast Container</div>,
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

// Mock de fetch global
global.fetch = jest.fn();

describe('CandidateDocumentsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra mensaje de carga inicialmente', async () => {
    // Mock de fetch para que no resuelva inmediatamente
    (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <MemoryRouter initialEntries={['/candidates/1/documents']}>
        <Routes>
          <Route path="/candidates/:id/documents" element={<CandidateDocumentsPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Buscar un elemento que indique carga, como un div con clase animate-pulse
    expect(screen.getByTestId('loading-pulse')).toBeInTheDocument();
  });
  
  test('muestra la información del candidato y los componentes de documentos', async () => {
    // Mock de fetch para devolver datos del candidato
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
        }
      }),
    });
    
    render(
      <MemoryRouter initialEntries={['/candidates/1/documents']}>
        <Routes>
          <Route path="/candidates/:id/documents" element={<CandidateDocumentsPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Esperar a que se cargue la información del candidato
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
    
    // Verificar que se muestran los componentes de documentos
    expect(screen.getByText('juan.perez@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('document-upload')).toBeInTheDocument();
    expect(screen.getByTestId('document-list')).toBeInTheDocument();
    expect(screen.getByText('DocumentUpload Mock')).toBeInTheDocument();
    expect(screen.getByText('DocumentList Mock')).toBeInTheDocument();
    // Usar getAllByText para manejar múltiples coincidencias
    expect(screen.getAllByText(/CandidateId: 1/)[0]).toBeInTheDocument();
  });
  
  test('muestra error cuando falla la carga del candidato', async () => {
    // Mock de fetch para devolver error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Error al obtener candidato' } }),
    });
    
    render(
      <MemoryRouter initialEntries={['/candidates/1/documents']}>
        <Routes>
          <Route path="/candidates/:id/documents" element={<CandidateDocumentsPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Esperar a que se muestre el error
    await waitFor(() => {
      // Usar el selector más específico para evitar ambigüedades
      expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument();
    });
    
    expect(screen.getByText('Error al obtener candidato')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Volver al Dashboard/i })).toBeInTheDocument();
  });
  
  test('actualiza el refreshTrigger cuando se sube un documento exitosamente', async () => {
    // Mock de fetch para devolver datos del candidato
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
        }
      }),
    });
    
    render(
      <MemoryRouter initialEntries={['/candidates/1/documents']}>
        <Routes>
          <Route path="/candidates/:id/documents" element={<CandidateDocumentsPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Esperar a que se cargue la información del candidato
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
    
    // Verificar que el refreshTrigger inicial es 0
    expect(screen.getByTestId('refresh-trigger')).toHaveTextContent('RefreshTrigger: 0');
    
    // Simular una carga exitosa de documento usando act para manejar actualizaciones de estado
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Simular Upload Success/i }));
    });
    
    // Verificar que el refreshTrigger se incrementó
    expect(screen.getByTestId('refresh-trigger')).toHaveTextContent('RefreshTrigger: 1');
  });
  
  test('maneja excepciones durante la carga del candidato', async () => {
    // Mock de console.error para evitar mensajes en la consola durante las pruebas
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock de fetch para lanzar una excepción
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error de red'));
    
    render(
      <MemoryRouter initialEntries={['/candidates/1/documents']}>
        <Routes>
          <Route path="/candidates/:id/documents" element={<CandidateDocumentsPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Esperar a que se muestre el error
    await waitFor(() => {
      // Usar el selector más específico para evitar ambigüedades
      expect(screen.getByRole('heading', { name: 'Error' })).toBeInTheDocument();
    });
    
    expect(screen.getByText('Error de red')).toBeInTheDocument();
  });
}); 