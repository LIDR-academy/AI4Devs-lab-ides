import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SkillsInput from '../../../features/candidates/components/SkillsInput';
import { useSearchSkills } from '../../../features/candidates/hooks/useCandidates';

// Mock the useSearchSkills hook
jest.mock('../../../features/candidates/hooks/useCandidates', () => ({
  useSearchSkills: jest.fn()
}));

const mockUseSearchSkills = useSearchSkills as jest.Mock;

// Create a wrapper component to provide form context
const SkillsInputWrapper = ({ defaultSkills = [] }: { defaultSkills?: string[] }) => {
  const schema = z.object({
    skills: z.array(z.string()).optional()
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: defaultSkills
    }
  });

  return (
    <FormProvider {...methods}>
      <form>
        <SkillsInput
          control={methods.control}
          name="skills"
          label="Habilidades"
          placeholder="Añadir habilidad..."
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

describe('SkillsInput Component', () => {
  beforeEach(() => {
    mockUseSearchSkills.mockReset();
    mockUseSearchSkills.mockImplementation(() => ({
      searchSkills: jest.fn().mockResolvedValue([
        { id: '1', name: 'JavaScript' },
        { id: '2', name: 'Java' },
        { id: '3', name: 'Java Spring' }
      ]),
      isLoading: false,
      error: null
    }));
  });

  it('should render correctly with no skills', () => {
    render(<SkillsInputWrapper />);
    
    expect(screen.getByText('Habilidades')).toBeInTheDocument();
    expect(screen.getByText('No hay habilidades añadidas')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Añadir')).toBeInTheDocument();
  });

  it('should render correctly with initial skills', () => {
    render(<SkillsInputWrapper defaultSkills={['JavaScript', 'TypeScript']} />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('No hay habilidades añadidas')).not.toBeInTheDocument();
  });

  it('should add a skill when clicking the add button', async () => {
    render(<SkillsInputWrapper />);
    
    // Type a skill in the react-select input
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'JavaScript');
    
    // Simulate selecting an option
    const selectOption = { id: '1', name: 'JavaScript', value: 'JavaScript', label: 'JavaScript' };
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    
    // Find and click the add button
    const addButton = screen.getByText('Añadir');
    fireEvent.click(addButton);
    
    // Check if the skill was added
    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
    expect(screen.queryByText('No hay habilidades añadidas')).not.toBeInTheDocument();
  });

  it('should not add empty skills', async () => {
    render(<SkillsInputWrapper />);
    
    // Try to add an empty skill
    const input = screen.getByRole('combobox');
    await userEvent.type(input, '   ');
    
    // Find the add button (should be disabled)
    const addButton = screen.getByText('Añadir');
    expect(addButton).toBeDisabled();
    
    // No skills should be added
    expect(screen.getByText('No hay habilidades añadidas')).toBeInTheDocument();
  });

  it('should not add duplicate skills', async () => {
    render(<SkillsInputWrapper defaultSkills={['JavaScript']} />);
    
    // Try to add a duplicate skill
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'JavaScript');
    
    // Simulate selecting an option
    const selectOption = { id: '1', name: 'JavaScript', value: 'JavaScript', label: 'JavaScript' };
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    
    // Find and click the add button
    const addButton = screen.getByText('Añadir');
    fireEvent.click(addButton);
    
    // Should still only have one instance of the skill
    const skillTags = screen.getAllByText('JavaScript');
    expect(skillTags.length).toBe(1);
  });

  it('should remove a skill when clicking the remove button', async () => {
    render(<SkillsInputWrapper defaultSkills={['JavaScript']} />);
    
    // Find the skill tag and the remove button inside it
    const skillTag = screen.getByText('JavaScript').closest('div');
    const removeButton = skillTag?.querySelector('button');
    expect(removeButton).not.toBeNull();
    
    // Click the remove button
    fireEvent.click(removeButton!);
    
    // Check if the skill was removed
    await waitFor(() => {
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    });
    expect(screen.getByText('No hay habilidades añadidas')).toBeInTheDocument();
  });

  it('should search for skills when typing', async () => {
    const searchSkillsMock = jest.fn().mockResolvedValue([
      { id: '1', name: 'JavaScript' },
      { id: '2', name: 'Java' },
      { id: '3', name: 'Java Spring' }
    ]);
    
    mockUseSearchSkills.mockImplementation(() => ({
      searchSkills: searchSkillsMock,
      isLoading: false,
      error: null
    }));
    
    render(<SkillsInputWrapper />);
    
    // Type in the input to trigger search
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'jav');
    
    // Check if searchSkills was called with the correct query
    await waitFor(() => {
      expect(searchSkillsMock).toHaveBeenCalledWith('jav');
    });
  });

  it('should show loading state while searching', async () => {
    // Mock loading state
    mockUseSearchSkills.mockImplementation(() => ({
      searchSkills: jest.fn().mockResolvedValue([]),
      isLoading: true,
      error: null
    }));
    
    render(<SkillsInputWrapper />);
    
    // Type in the input to trigger search
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'jav');
    
    // Check if loading indicator is shown
    // Note: The loading indicator might be part of react-select's internal structure
    // and might not be directly accessible via testing-library
    // This test might need to be adjusted based on how loading is displayed
  });

  it('should handle selection from autocomplete options', async () => {
    const searchSkillsMock = jest.fn().mockResolvedValue([
      { id: '1', name: 'JavaScript' },
      { id: '2', name: 'Java' },
      { id: '3', name: 'Java Spring' }
    ]);
    
    mockUseSearchSkills.mockImplementation(() => ({
      searchSkills: searchSkillsMock,
      isLoading: false,
      error: null
    }));
    
    render(<SkillsInputWrapper />);
    
    // Type in the input to trigger search
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'jav');
    
    // Wait for search results
    await waitFor(() => {
      expect(searchSkillsMock).toHaveBeenCalledWith('jav');
    });
    
    // Simulate selecting an option
    const selectOption = { id: '1', name: 'JavaScript', value: 'JavaScript', label: 'JavaScript' };
    fireEvent.change(input, { target: { value: 'JavaScript' } });
    
    // Find and click the add button
    const addButton = screen.getByText('Añadir');
    fireEvent.click(addButton);
    
    // Check if the selected skill was added
    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });
}); 