import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import CandidateList from './pages/candidates/CandidateList';
import CandidateForm from './pages/candidates/CandidateForm';
import CandidateDetail from './pages/candidates/CandidateDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="candidates" replace />} />
            <Route path="candidates" element={<CandidateList />} />
            <Route path="candidates/new" element={<CandidateForm />} />
            <Route path="candidates/:id" element={<CandidateDetail />} />
            <Route path="candidates/:id/edit" element={<CandidateForm />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
