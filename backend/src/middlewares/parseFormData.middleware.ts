import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to parse JSON data from formData
 * This middleware extracts the 'data' field from multipart/form-data requests,
 * parses it as JSON, and merges it into req.body
 */
export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if data field exists in the request body
    if (req.body && req.body.data && typeof req.body.data === 'string') {
      try {
        // Parse the JSON string
        const parsedData = JSON.parse(req.body.data);

        // Merge the parsed data into req.body
        req.body = { ...req.body, ...parsedData };
      } catch (error) {
        console.error('Error parsing JSON data from form:', error);
      }
    }
    next();
  } catch (error) {
    console.error('Error in parseFormData middleware:', error);
    next();
  }
};