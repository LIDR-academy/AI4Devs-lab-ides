import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import NewCandidate from './pages/NewCandidate';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="candidates/new" element={<NewCandidate />} />
      </Route>
    </Routes>
  );
} 