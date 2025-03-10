import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecluterDashboard from './pages/RecluterDashboard';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route path="/recluter-dashboard" element={<RecluterDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
