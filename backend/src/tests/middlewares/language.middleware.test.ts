import { Request, Response, NextFunction } from 'express';
import { languageMiddleware } from '../../middlewares/language.middleware';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../../utils/i18n.utils';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('Language Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      query: {}  // Add empty query object
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should set language to default (en_US) when no Accept-Language header is provided', () => {
    // Arrange - empty headers and query

    // Act
    languageMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.language).toBe(DEFAULT_LANGUAGE);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should set language to en_US when en-US is provided', () => {
    // Arrange
    mockRequest.headers = {
      'accept-language': 'en-US',
    };

    // Act
    languageMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.language).toBe(LANGUAGES.EN_US);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should set language to es_ES when es-ES is provided', () => {
    // Arrange
    mockRequest.headers = {
      'accept-language': 'es-ES',
    };

    // Act
    languageMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.language).toBe(LANGUAGES.ES_ES);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should set language to default when unsupported language is provided', () => {
    // Arrange
    mockRequest.headers = {
      'accept-language': 'fr-FR',
    };

    // Act
    languageMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.language).toBe(DEFAULT_LANGUAGE);
    expect(nextFunction).toHaveBeenCalled();
  });
});