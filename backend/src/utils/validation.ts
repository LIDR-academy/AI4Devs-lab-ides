import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

/**
 * Valida el formato de un email
 * @param email Email a validar
 * @returns true si el email es válido, false en caso contrario
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

/**
 * Sanitiza una cadena de texto eliminando código HTML malicioso
 * @param input Texto a sanitizar
 * @returns Texto sanitizado
 */
export function sanitizeInput(input: string | null): string | null {
  if (input === null) return null;
  if (input === undefined) return null;
  if (input.trim() === '') return input;
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
} 