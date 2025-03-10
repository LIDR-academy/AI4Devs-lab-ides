import React from 'react';
import './App.css';
import PaginaCandidato from './components/candidatos/PaginaCandidato';
import { Container, Navbar } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Sistema de Seguimiento de Talento (ATS)</Navbar.Brand>
        </Container>
      </Navbar>
      
      <main className="bg-light min-vh-100 py-3">
        <PaginaCandidato />
      </main>
      
      <footer className="bg-dark text-white py-3 text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} Sistema ATS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
