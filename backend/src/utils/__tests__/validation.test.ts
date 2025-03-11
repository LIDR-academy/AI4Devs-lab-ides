import { validateEmail, sanitizeInput } from '../validation';

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user-name@domain-test.com')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('test@domain')).toBe(false);
    expect(validateEmail('test.domain.com')).toBe(false);
  });

  it('should return false for empty or invalid input', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(' ')).toBe(false);
    expect(validateEmail('not-an-email')).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('should remove HTML tags and scripts', () => {
    expect(sanitizeInput('<script>alert("xss")</script>text')).toBe('text');
    expect(sanitizeInput('<p>text</p>')).toBe('text');
    expect(sanitizeInput('<img src="x" onerror="alert(1)">text')).toBe('text');
  });

  it('should handle null and undefined values', () => {
    expect(sanitizeInput(null)).toBeNull();
    expect(sanitizeInput(undefined as unknown as string)).toBeNull();
  });

  it('should preserve empty strings', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(' ')).toBe(' ');
  });

  it('should trim whitespace', () => {
    expect(sanitizeInput(' text ')).toBe('text');
    expect(sanitizeInput('  text  text  ')).toBe('text  text');
  });

  it('should handle complex HTML structures', () => {
    const input = `
      <div class="container">
        <h1>Title</h1>
        <p>Some text with <strong>bold</strong> and <em>italic</em></p>
        <script>malicious();</script>
      </div>
    `;
    const sanitized = sanitizeInput(input);
    expect(sanitized?.trim().replace(/\s+/g, ' ')).toBe('Title Some text with bold and italic');
    // Verificar que no hay tags HTML
    expect(sanitized).not.toMatch(/<[^>]*>/);
    // Verificar que no hay scripts
    expect(sanitized).not.toContain('malicious');
  });
}); 