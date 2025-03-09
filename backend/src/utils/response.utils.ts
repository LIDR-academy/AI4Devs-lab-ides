/**
 * Format successful response
 * @param data Data to be returned in the response
 * @param message Optional message
 * @returns Formatted response object
 */
export const formatResponse = (data: any, message?: string) => {
  return {
    success: true,
    message: message || 'Operation successful',
    data,
  };
};

/**
 * Format error response
 * @param message Error message
 * @param errors Optional validation errors
 * @returns Formatted error object
 */
export const formatError = (message: string, errors?: any) => {
  return {
    success: false,
    message,
    ...(errors && { errors }),
  };
};