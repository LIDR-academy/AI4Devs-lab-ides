import React from 'react';
import './App.css';
import AddCandidateForm from './components/AddCandidateForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Seguimiento de Talento</h1>
        <AddCandidateForm />
      </header>
    </div>
  );
}

export default App;