import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FormularioCandidato from './components/FormularioCandidato';
import ListaCandidatos from './components/ListaCandidatos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sistema ATS</h1>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Navigate to="/candidatos" replace />} />
            <Route path="/candidatos" element={<ListaCandidatos />} />
            <Route path="/candidatos/nuevo" element={<FormularioCandidato />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>Sistema de Seguimiento de Candidatos &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
