import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';

describe('LandingPage', () => {
  test('renders landing page with correct content', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    
    // Verificar que el título principal está presente
    expect(screen.getByText('Simplify Your Recruitment Process')).toBeInTheDocument();
    
    // Verificar que el botón de login está presente
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // Verificar que las secciones principales están presentes
    expect(screen.getByText('Powerful Features for Modern Recruiters')).toBeInTheDocument();
    expect(screen.getByText('Trusted by Recruiters Worldwide')).toBeInTheDocument();
    expect(screen.getByText('Ready to Transform Your Recruitment Process?')).toBeInTheDocument();
    
    // Verificar que las características están presentes
    expect(screen.getByText('Candidate Management')).toBeInTheDocument();
    expect(screen.getByText('Advanced Search')).toBeInTheDocument();
    expect(screen.getByText('Streamlined Workflow')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument();
    expect(screen.getByText('Data Security')).toBeInTheDocument();
    expect(screen.getByText('GDPR Compliant')).toBeInTheDocument();
  });
}); 