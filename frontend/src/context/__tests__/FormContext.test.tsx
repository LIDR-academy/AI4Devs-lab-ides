import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { FormProvider, useForm } from '../FormContext';
import { CandidateFormData } from '../../types/candidate';

describe('FormContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FormProvider>{children}</FormProvider>
  );

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useForm(), { wrapper });

    expect(result.current.state.currentStep).toBe('personal');
    expect(result.current.state.formData).toBeDefined();
    expect(result.current.state.isSubmitting).toBe(false);
    expect(result.current.state.submitError).toBeNull();
  });

  it('should update form data', () => {
    const { result } = renderHook(() => useForm(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: { firstName: 'John', lastName: 'Doe' }
      });
    });

    expect(result.current.state.formData.firstName).toBe('John');
    expect(result.current.state.formData.lastName).toBe('Doe');
  });

  it('should change steps', () => {
    const { result } = renderHook(() => useForm(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'SET_STEP',
        payload: 'education'
      });
    });

    expect(result.current.state.currentStep).toBe('education');
  });

  it('should handle submission state', () => {
    const { result } = renderHook(() => useForm(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'SET_SUBMITTING',
        payload: true
      });
    });

    expect(result.current.state.isSubmitting).toBe(true);
  });

  it('should handle errors', () => {
    const { result } = renderHook(() => useForm(), { wrapper });
    const errorMessage = 'Test error message';

    act(() => {
      result.current.dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });
    });

    expect(result.current.state.submitError).toBe(errorMessage);
  });

  it('should reset form', () => {
    const { result } = renderHook(() => useForm(), { wrapper });

    // First set some data
    act(() => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: { firstName: 'John' }
      });
    });

    // Then reset
    act(() => {
      result.current.dispatch({ type: 'RESET_FORM' });
    });

    expect(result.current.state.formData.firstName).toBe('');
    expect(result.current.state.currentStep).toBe('personal');
  });

  it('should throw error when useForm is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const TestComponent = () => {
      useForm();
      return null;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useForm must be used within a FormProvider');

    consoleError.mockRestore();
  });
}); 