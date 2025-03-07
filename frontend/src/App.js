import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail'; // Importar el componente UserDetail
import './App.css'; // Importar el archivo CSS

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/add-user" element={<UserForm />} />
            <Route path="/user/:id" element={<UserDetail />} /> {/* Nueva ruta para el detalle del usuario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;