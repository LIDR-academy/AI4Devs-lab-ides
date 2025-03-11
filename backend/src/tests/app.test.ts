import request from 'supertest';
import app from '../app';
import { Request, Response, NextFunction } from 'express'; // Import the necessary types

describe('GET /', () => {
    it('responds with API message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        // The response is now an HTML page, so we'll just check if it contains the expected text
        expect(response.text).toContain('API del Sistema de Gestión de Candidatos');
    });
});
