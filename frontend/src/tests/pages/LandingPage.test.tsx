import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';

describe('LandingPage', () => {
  it('renders landing page with correct content', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    
    // Verificar que el título principal está presente
    expect(screen.getByText('Simplify Your Recruitment Process')).toBeInTheDocument();
    
    // Verificar que la descripción está presente
    expect(screen.getByText(/Our Applicant Tracking System helps you manage candidates efficiently/)).toBeInTheDocument();
    
    // Verificar que el botón de inicio está presente
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    
    // Verificar que las características están presentes usando queryAllByText para elementos duplicados
    expect(screen.queryAllByText('Candidate Management').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Advanced Search').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Streamlined Workflow').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Analytics & Reporting').length).toBeGreaterThan(0);
  });
}); 