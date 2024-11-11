import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Candidatos',
      version: '1.0.0',
      description: 'API para gestión de candidatos en el sistema ATS',
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options); 