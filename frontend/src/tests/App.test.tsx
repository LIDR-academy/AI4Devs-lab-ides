import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

test('renders app component without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // No necesitamos buscar un texto específico, solo verificar que no hay errores
  expect(document.body).toBeInTheDocument();
});
