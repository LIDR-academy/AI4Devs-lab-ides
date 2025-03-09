import request from 'supertest';
import { app, server } from '../index';
import prisma from '../index'; // Import the Prisma client

describe('GET /', () => {
    it('responds with Hola LTI!', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hola LTI!');
    });
});

afterAll(async () => {
    await prisma.$disconnect(); // Close the Prisma client connection
    server.close(); // Close the server
});
