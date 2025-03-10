import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateSummary from './components/candidates/CandidateSummary';
import { ROUTES } from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Sistema de Seguimiento de Candidatos</h1>
        </header>
        <main className="App-main">
          <Routes>
            <Route path={ROUTES.HOME} element={<Dashboard />} />
            <Route path={ROUTES.ADD_CANDIDATE} element={<AddCandidate />} />
            <Route path={ROUTES.CANDIDATE_SUMMARY} element={<CandidateSummary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
