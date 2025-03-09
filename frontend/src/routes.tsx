import { Routes, Route } from 'react-router-dom';
import { CandidateList } from './pages/CandidateList';
import { CandidateForm } from './pages/CandidateForm';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CandidateList />} />
      <Route path="/candidates/new" element={<CandidateForm />} />
      <Route path="/candidates/:id" element={<CandidateForm />} />
    </Routes>
  );
}; 