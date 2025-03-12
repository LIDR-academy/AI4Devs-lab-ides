import React, { useState } from 'react';
import { AddCandidatePage } from './pages/AddCandidatePage';
import { CandidatesPage } from './pages/CandidatesPage';
import { RecentCandidates } from './components/candidates/RecentCandidates';

/**
 * Componente principal de la aplicación
 */
const App: React.FC = () => {
  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState<'dashboard' | 'candidates' | 'addCandidate'>('dashboard');

  // Función para cambiar a la vista de añadir candidato
  const handleAddCandidateClick = () => {
    setCurrentView('addCandidate');
  };

  // Función para volver al dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Función para ir a la vista de candidatos
  const handleNavigateToCandidates = () => {
    setCurrentView('candidates');
  };

  // Renderizar la vista de añadir candidato
  if (currentView === 'addCandidate') {
    return (
      <AddCandidatePage 
        onNavigateToDashboard={handleBackToDashboard} 
        onNavigateToCandidates={handleNavigateToCandidates}
      />
    );
  }

  // Renderizar la vista de candidatos
  if (currentView === 'candidates') {
    return (
      <CandidatesPage 
        onNavigateToDashboard={handleBackToDashboard}
        onAddCandidateClick={handleAddCandidateClick}
      />
    );
  }

  // Renderizar el dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <RecentCandidates 
              onViewAllClick={handleNavigateToCandidates}
              onAddCandidateClick={handleAddCandidateClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 