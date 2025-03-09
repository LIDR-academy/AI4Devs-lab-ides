import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Candidatos',
      version: '1.0.0',
      description: 'API para gestionar candidatos, sus datos personales, educación, experiencia y CV',
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {
        Education: {
          type: 'object',
          properties: {
            institution: { type: 'string' },
            degree: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' }
          }
        },
        WorkExperience: {
          type: 'object',
          properties: {
            company: { type: 'string' },
            position: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            description: { type: 'string' }
          }
        },
        CreateCandidateDto: {
          type: 'object',
          required: ['name', 'lastName', 'email'],
          properties: {
            name: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            education: {
              type: 'array',
              items: { $ref: '#/components/schemas/Education' }
            },
            workExperience: {
              type: 'array',
              items: { $ref: '#/components/schemas/WorkExperience' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/infrastructure/swagger/*.swagger.ts'],
};

export const specs = swaggerJsdoc(options); 