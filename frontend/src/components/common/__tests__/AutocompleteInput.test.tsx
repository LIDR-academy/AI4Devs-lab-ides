import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AutocompleteInput } from '../AutocompleteInput';
import '@testing-library/jest-dom';

describe('AutocompleteInput', () => {
  const mockSuggestions = ['Google', 'Microsoft', 'Apple'];
  
  test('muestra sugerencias al escribir', () => {
    render(
      <AutocompleteInput
        label="Empresa"
        suggestions={mockSuggestions}
        value=""
        onChange={() => {}}
      />
    );
    
    const input = screen.getByLabelText('Empresa');
    
    // Activar el foco y escribir en el input
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Goo' } });
    
    // Verifica que aparezca la sugerencia
    expect(screen.getByText('Google')).toBeInTheDocument();
  });
}); 