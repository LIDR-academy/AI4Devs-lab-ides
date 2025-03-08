import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RecruiterRoute from './components/RecruiterRoute';
import CandidateList from './pages/candidates/CandidateList';
import CandidateForm from './pages/candidates/CandidateForm';
import CandidateDetail from './pages/candidates/CandidateDetail';
import ProcessList from './pages/processes/ProcessList';
import ProcessForm from './pages/processes/ProcessForm';
import ProcessDetail from './pages/processes/ProcessDetail';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Recruiter routes */}
          <Route element={<RecruiterRoute />}>
            <Route path="candidates">
              <Route index element={<CandidateList />} />
              <Route path="new" element={<CandidateForm />} />
              <Route path=":id" element={<CandidateDetail />} />
              <Route path=":id/edit" element={<CandidateForm />} />
            </Route>
            
            <Route path="processes">
              <Route index element={<ProcessList />} />
              <Route path="new" element={<ProcessForm />} />
              <Route path=":id" element={<ProcessDetail />} />
              <Route path=":id/edit" element={<ProcessForm />} />
              <Route path="candidate/:candidateId" element={<ProcessList />} />
            </Route>
          </Route>
        </Route>
        
        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;
