import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AddCandidateForm from "./domain/candidate/AddCandidateForm/AddCandidateForm";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="navbar">
          <div>LTI</div>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/add-candidate">Añadir Candidato</Link>
          </nav>
        </header>
        <div className="App-header">
          <Routes>
            <Route path="/add-candidate" element={<AddCandidateForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
