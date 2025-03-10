import React from 'react';
import './App.css';
import AddCandidateButton from './components/candidates/AddCandidateButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Seguimiento de Talento (LTI)</h1>
        <div className="header-actions">
          <AddCandidateButton />
        </div>
      </header>
      <main className="App-main">
        <div className="dashboard">
          <h2>Dashboard de Candidatos</h2>
          <p>Bienvenido al Sistema de Seguimiento de Talento. Utiliza el botón "Añadir Candidato" para comenzar a registrar nuevos talentos.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
