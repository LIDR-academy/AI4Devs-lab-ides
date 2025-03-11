// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddCandidateForm from './components/AddCandidateForm';
import CandidateList from './components/CandidateList';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <nav className="mb-4">
          <Link to="/" className="mr-4 text-blue-500">Ver Candidatos</Link>
          <Link to="/add-candidate" className="text-blue-500">Añadir Candidato</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CandidateList />} />
          <Route path="/add-candidate" element={<AddCandidateForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
