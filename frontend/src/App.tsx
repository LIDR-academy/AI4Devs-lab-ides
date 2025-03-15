import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddCandidate from './components/AddCandidate'; // Asegúrate de que la ruta sea correcta
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>LTI - Sistema de Seguimiento de Talento</h1>
          <nav>
            <Link to="/">Inicio</Link> | 
            <Link to="/candidates/add">Añadir Candidato</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<h2>Bienvenido al Sistema de Seguimiento de Talento</h2>} />
            <Route path="/candidates/add" element={<AddCandidate />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
