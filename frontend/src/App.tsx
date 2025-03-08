import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AddCandidatePage from './pages/AddCandidatePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-candidate" element={<AddCandidatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
