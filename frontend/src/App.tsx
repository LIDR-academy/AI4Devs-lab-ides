import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './features/auth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import CandidateDocumentsPage from './pages/CandidateDocumentsPage';
import AddCandidatePage from './pages/AddCandidatePage';
import CandidateSuccessPage from './pages/CandidateSuccessPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import CandidateEditPage from './pages/CandidateEditPage';
import CandidateEditSuccessPage from './pages/CandidateEditSuccessPage';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="candidates/add" element={<AddCandidatePage />} />
        <Route path="candidates/success" element={<CandidateSuccessPage />} />
        <Route path="candidates/:id/documents" element={<CandidateDocumentsPage />} />
        <Route path="candidates/edit/success/:id" element={<CandidateEditSuccessPage />} />
        <Route path="dashboard/candidates/:id" element={<CandidateDetailPage />} />
        <Route path="dashboard/candidates/edit/:id" element={<CandidateEditPage />} />
        {/* Aquí puedes añadir más rutas protegidas */}
      </Route>
      
      {/* Redirigir a la landing page por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
