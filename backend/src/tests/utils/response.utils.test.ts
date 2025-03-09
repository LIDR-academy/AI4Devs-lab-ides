import { formatResponse, formatError } from '../../utils/response.utils';

describe('Response Utilities', () => {
  describe('formatResponse', () => {
    it('should format a successful response with data', () => {
      const data = { id: 1, name: 'Test' };
      const message = 'Operation successful';

      const result = formatResponse(data, message);

      expect(result).toEqual({
        success: true,
        message,
        data
      });
    });

    it('should format a successful response without data', () => {
      const message = 'Operation successful';

      const result = formatResponse(null, message);

      expect(result).toEqual({
        success: true,
        message,
        data: null
      });
    });
  });

  describe('formatError', () => {
    it('should format an error response with message', () => {
      const message = 'Operation failed';

      const result = formatError(message);

      expect(result).toEqual({
        success: false,
        message
      });
    });

    it('should format an error response with message and errors', () => {
      const message = 'Operation failed';
      const errors = ['Error 1', 'Error 2'];

      const result = formatError(message, errors);

      expect(result).toEqual({
        success: false,
        message,
        errors
      });
    });
  });
});