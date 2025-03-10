import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UserList from './components/UserList';
import AddCandidate from './pages/AddCandidate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Seguimiento de Talento (LTI)
              </h1>
              <nav className="flex space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Inicio
                </Link>
                <Link to="/candidates/add" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Añadir Candidato
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/candidates/add" element={<AddCandidate />} />
              </Routes>
            </div>
          </div>
        </main>
        <footer className="bg-white shadow mt-auto py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Sistema LTI. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
