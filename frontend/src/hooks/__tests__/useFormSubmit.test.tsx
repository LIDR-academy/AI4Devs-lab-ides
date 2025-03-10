import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { FormProvider } from '../../context/FormContext';
import { useFormSubmit } from '../useFormSubmit';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

describe('useFormSubmit', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FormProvider>{children}</FormProvider>
  );

  it('should validate personal step correctly', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    await act(async () => {
      expect(result.current.validateStep('personal')).toBe(false);
    });

    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890'
        }
      });
    });

    await act(async () => {
      expect(result.current.validateStep('personal')).toBe(true);
    });
  });

  it('should validate education step correctly', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    await act(async () => {
      expect(result.current.validateStep('education')).toBe(false);
    });

    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          education: [{
            title: 'Computer Science',
            institution: 'University',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }]
        }
      });
    });

    await act(async () => {
      expect(result.current.validateStep('education')).toBe(true);
    });
  });

  it('should validate experience step correctly', async () => {
    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    await act(async () => {
      expect(result.current.validateStep('experience')).toBe(false);
    });

    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          workExperience: [{
            company: 'Company',
            position: 'Developer',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }]
        }
      });
    });

    await act(async () => {
      expect(result.current.validateStep('experience')).toBe(true);
    });
  });

  it('should submit form data successfully', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '123' })
      })
    );

    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    // Prepare form data
    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          education: [{
            title: 'Computer Science',
            institution: 'University',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }],
          workExperience: [{
            company: 'Company',
            position: 'Developer',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }]
        }
      });
    });

    let error = null;
    await act(async () => {
      try {
        await result.current.submitForm();
      } catch (e) {
        error = e;
      }
    });

    expect(error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBe(null);
  });

  it('should handle submission errors', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })
    );

    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    // Prepare valid form data first
    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          education: [{
            title: 'Computer Science',
            institution: 'University',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }],
          workExperience: [{
            company: 'Company',
            position: 'Developer',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }]
        }
      });
    });

    let error = null;
    await act(async () => {
      try {
        await result.current.submitForm();
      } catch (e) {
        error = e;
      }
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBe('Failed to create candidate');
  });

  it('should handle document upload', async () => {
    mockFetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '123' })
        })
      )
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      );

    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          education: [{
            title: 'Computer Science',
            institution: 'University',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }],
          workExperience: [{
            company: 'Company',
            position: 'Developer',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }],
          document: { file: mockFile, name: mockFile.name }
        }
      });
    });

    let error = null;
    await act(async () => {
      try {
        await result.current.submitForm();
      } catch (e) {
        error = e;
      }
    });

    expect(error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch.mock.calls[1][0]).toContain('/document');
    expect(result.current.submitError).toBe(null);
  });

  it('should handle document upload error', async () => {
    mockFetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '123' })
        })
      )
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: false
        })
      );

    const { result } = renderHook(() => useFormSubmit(), { wrapper });

    await act(async () => {
      result.current.dispatch({
        type: 'UPDATE_DATA',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          education: [{
            title: 'Computer Science',
            institution: 'University',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }],
          workExperience: [{
            company: 'Company',
            position: 'Developer',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2024-01-01')
          }],
          document: { file: mockFile, name: mockFile.name }
        }
      });
    });

    let error = null;
    await act(async () => {
      try {
        await result.current.submitForm();
      } catch (e) {
        error = e;
      }
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBe('Failed to upload document');
  });
}); 