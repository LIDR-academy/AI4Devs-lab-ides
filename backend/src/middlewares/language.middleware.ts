import { Request, Response, NextFunction } from 'express';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../utils/i18n.utils';

/**
 * Middleware to detect and set the language for the request
 */
export const languageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get language from header, query, or default
  let lang =
    req.headers['accept-language'] ||
    req.query.lang as string ||
    DEFAULT_LANGUAGE;

  // Convert language code format if needed (e.g., 'en-US' to 'en_US')
  if (lang && lang.includes('-')) {
    lang = lang.replace('-', '_');
  }

  // Check if language is supported
  const supportedLang = Object.values(LANGUAGES).includes(lang)
    ? lang
    : DEFAULT_LANGUAGE;

  // Set language in request object
  req.language = supportedLang;

  next();
};

// Extend Express Request interface to include language
declare global {
  namespace Express {
    interface Request {
      language: string;
    }
  }
}