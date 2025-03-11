import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddCandidatePage } from './pages/candidates/AddCandidate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/candidates/add" element={<AddCandidatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;