import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalInfoStep from '../PersonalInfoStep';
import { FormProvider } from '../../../../context/FormContext';

type FormAction = {
  type: 'UPDATE_DATA';
  payload: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }>;
};

const mockDispatch = jest.fn();
let mockFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
};

// Mock the useForm hook at module level
jest.mock('../../../../context/FormContext', () => {
  const actual = jest.requireActual('../../../../context/FormContext');
  return {
    ...actual,
    useForm: () => ({
      state: {
        formData: mockFormData,
        submitError: null
      },
      dispatch: (action: FormAction) => {
        mockDispatch(action);
        if (action.type === 'UPDATE_DATA') {
          mockFormData = { ...mockFormData, ...action.payload };
        }
      }
    })
  };
});

describe('PersonalInfoStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mockFormData to initial state
    mockFormData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
  });

  const renderPersonalInfoStep = () => {
    const { rerender, ...rest } = render(
      <FormProvider>
        <PersonalInfoStep />
      </FormProvider>
    );

    return {
      ...rest,
      rerender: () => rerender(
        <FormProvider>
          <PersonalInfoStep />
        </FormProvider>
      )
    };
  };

  it('renders all required fields', () => {
    renderPersonalInfoStep();
    
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  it('shows validation error for empty first name on blur', async () => {
    renderPersonalInfoStep();
    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.focus(firstNameInput);
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const { rerender } = renderPersonalInfoStep();
    
    const emailInput = screen.getByLabelText(/Email/i);
    
    // First set a valid email
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'valid@email.com' }
      });
    });
    rerender();
    fireEvent.blur(emailInput);
    
    // Then set invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'invalid-email' }
      });
    });
    rerender();
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid phone format', async () => {
    const { rerender } = renderPersonalInfoStep();
    
    const phoneInput = screen.getByLabelText(/Phone/i);
    
    // First set a valid phone
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { phone: '1234567890' }
      });
    });
    rerender();
    fireEvent.blur(phoneInput);
    
    // Then set invalid phone
    fireEvent.change(phoneInput, { target: { value: 'abc' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { phone: 'abc' }
      });
    });
    rerender();
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid phone number format')).toBeInTheDocument();
    });
  });

  it('updates form data when valid input is provided', async () => {
    const { rerender } = renderPersonalInfoStep();
    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { firstName: 'John' }
      });
    });
    rerender();

    const lastNameInput = screen.getByLabelText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { lastName: 'Doe' }
      });
    });
    rerender();

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'john.doe@example.com' }
      });
    });
    rerender();

    const phoneInput = screen.getByLabelText(/Phone/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { phone: '1234567890' }
      });
    });
    rerender();
  });

  it('clears validation errors when valid input is provided', async () => {
    const { rerender } = renderPersonalInfoStep();
    
    const emailInput = screen.getByLabelText(/Email/i);
    
    // First set a valid email
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'valid@email.com' }
      });
    });
    rerender();
    fireEvent.blur(emailInput);
    
    // Then set invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'invalid-email' }
      });
    });
    rerender();
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });

    // Finally set valid email again
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'valid@email.com' }
      });
    });
    rerender();
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
    });
  });

  it('validates multiple fields in sequence', async () => {
    const { rerender } = renderPersonalInfoStep();
    
    // Check all fields are initially empty and show required errors on blur
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const phoneInput = screen.getByLabelText(/Phone/i);

    // Blur all fields without values
    fireEvent.focus(firstNameInput);
    fireEvent.blur(firstNameInput);
    fireEvent.focus(lastNameInput);
    fireEvent.blur(lastNameInput);
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    fireEvent.focus(phoneInput);
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });

    // Fill in all fields with valid values
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { firstName: 'John' }
      });
    });
    rerender();
    fireEvent.blur(firstNameInput);

    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { lastName: 'Doe' }
      });
    });
    rerender();
    fireEvent.blur(lastNameInput);

    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { email: 'john.doe@example.com' }
      });
    });
    rerender();
    fireEvent.blur(emailInput);

    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: { phone: '1234567890' }
      });
    });
    rerender();
    fireEvent.blur(phoneInput);

    // Verify no error messages are shown
    await waitFor(() => {
      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Last name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Phone number is required')).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });

  // TODO: Fix email validation test
  /*
  it('handles edge cases in email format validation', async () => {
    const { rerender } = renderPersonalInfoStep();
    const emailInput = screen.getByLabelText(/Email/i);

    // First check empty field validation
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      const errorElement = screen.getByText('Email is required');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.tagName.toLowerCase()).toBe('p');
      expect(errorElement).toHaveClass('mt-1', 'text-sm', 'text-red-600');
    });

    const invalidEmails = [
      'test@', // Missing domain
      '@domain.com', // Missing local part
      'test@domain', // Missing TLD
      'test.domain.com', // Missing @
      'test@@domain.com', // Multiple @
      'test@domain..com', // Multiple dots
      'test@.com', // Missing domain part
      'test@domain.', // Incomplete TLD
    ];

    for (const invalidEmail of invalidEmails) {
      // Set invalid email
      fireEvent.change(emailInput, { target: { value: invalidEmail } });
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_DATA',
          payload: { email: invalidEmail }
        });
      });
      rerender();

      // Trigger validation
      fireEvent.blur(emailInput);

      // Wait for the error message with correct classes
      await waitFor(() => {
        const errorElement = screen.getByText('Invalid email format');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement.tagName.toLowerCase()).toBe('p');
        expect(errorElement).toHaveClass('mt-1', 'text-sm', 'text-red-600');
      }, { timeout: 2000 });
    }

    // Test valid email formats
    const validEmails = [
      'test@domain.com',
      'test.name@domain.com',
      'test+label@domain.com',
      'test@sub.domain.com',
      'test@domain-name.com',
      '123@domain.com',
      'test@123.com',
    ];

    for (const validEmail of validEmails) {
      // Set valid email
      fireEvent.change(emailInput, { target: { value: validEmail } });
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_DATA',
          payload: { email: validEmail }
        });
      });
      rerender();

      // Trigger validation
      fireEvent.blur(emailInput);

      // Check that no errors are shown
      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    }
  });
  */

  it('handles edge cases in phone format validation', async () => {
    const { rerender } = renderPersonalInfoStep();
    const phoneInput = screen.getByLabelText(/Phone/i);
    
    const invalidPhones = [
      '123', // Too short
      'abcdefghijk', // Non-numeric
      '123-abc-4567', // Mixed invalid characters
      '12345', // Too short
      '123456789', // 9 digits
    ];

    for (const invalidPhone of invalidPhones) {
      fireEvent.change(phoneInput, { target: { value: invalidPhone } });
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_DATA',
          payload: { phone: invalidPhone }
        });
      });
      rerender();
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(screen.getByText('Invalid phone number format')).toBeInTheDocument();
      });
    }

    // Test valid phone formats
    const validPhones = [
      '1234567890', // 10 digits
      '123-456-7890', // With hyphens
      '123 456 7890', // With spaces
      '+1234567890', // With plus
      '+1 234 567 890', // International format
    ];

    for (const validPhone of validPhones) {
      fireEvent.change(phoneInput, { target: { value: validPhone } });
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_DATA',
          payload: { phone: validPhone }
        });
      });
      rerender();
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(screen.queryByText('Invalid phone number format')).not.toBeInTheDocument();
      });
    }
  });

  it('maintains form state between renders', async () => {
    const { rerender } = renderPersonalInfoStep();
    
    // Fill in all fields
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890'
    };

    // Update each field and verify it persists
    for (const [field, value] of Object.entries(testData)) {
      const input = screen.getByLabelText(new RegExp(field.replace(/([A-Z])/g, ' $1').trim(), 'i'));
      fireEvent.change(input, { target: { value } });
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'UPDATE_DATA',
          payload: { [field]: value }
        });
      });
      rerender();
    }

    // Re-render the component
    rerender();

    // Verify all values are maintained
    for (const [field, value] of Object.entries(testData)) {
      const input = screen.getByLabelText(new RegExp(field.replace(/([A-Z])/g, ' $1').trim(), 'i'));
      expect(input).toHaveValue(value);
    }
  });
}); 