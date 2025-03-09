import React from 'react';
import './App.css';
import CandidatesPage from './pages/CandidatesPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="header-content">
            <h1>HR Talent Tracking System</h1>
            <div className="header-actions">
              <a href="https://example.com/help" className="header-link">Help</a>
            </div>
          </div>
        </div>
      </header>
      <main>
        <CandidatesPage />
      </main>
      <footer className="App-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <strong>LTI</strong> HR System
            </div>
            <div className="footer-info">
              <p>&copy; {new Date().getFullYear()} LTI - Sistema de Seguimiento de Talento</p>
              <p className="footer-version">Version 1.0.0</p>
            </div>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
