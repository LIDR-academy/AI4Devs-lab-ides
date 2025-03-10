import React from 'react';
import './App.css';
import PaginaCandidato from './components/candidatos/PaginaCandidato';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Sistema de Seguimiento de Talento (ATS)</h1>
        </div>
      </header>
      
      <main className="bg-gray-100 min-h-screen">
        <PaginaCandidato />
      </main>
      
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Sistema ATS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
