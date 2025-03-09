import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Candidate Management API',
      version: '1.0.0',
      description: 'API for managing job candidates',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3010',
      },
    ],
    components: {
      schemas: {
        Candidate: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'Unique identifier for the candidate',
            },
            firstName: {
              type: 'string',
              description: 'Candidate first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'Candidate last name',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Candidate email address',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              description: 'Candidate phone number',
              example: '+1234567890',
            },
            address: {
              type: 'string',
              description: 'Candidate address',
              example: '123 Main St',
            },
            resumeUrl: {
              type: 'string',
              description: "URL to the candidate's resume",
              example: '/resumes/john_doe_resume.pdf',
            },
            education: {
              type: 'string',
              description: 'Education information (simplified)',
              example: 'BS in Computer Science, Harvard University, 2018-2022',
            },
            experience: {
              type: 'string',
              description: 'Work experience information (simplified)',
              example: 'Software Engineer at Google, 2022-Present',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Timestamp when the candidate was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Timestamp when the candidate was last updated',
            },
          },
          required: ['firstName', 'lastName', 'email'],
        },
      },
    },
  },
  apis: [path.resolve(__dirname, '../routes/*.ts')],
};

const specs = swaggerJsdoc(options);

// Enhance the Swagger UI options for better form handling
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    validatorUrl: null,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    syntaxHighlight: {
      activate: true,
      theme: 'agate',
    },
  },
};

export { swaggerUi, specs, swaggerOptions };
