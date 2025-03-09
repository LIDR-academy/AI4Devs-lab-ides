import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Opciones de configuración de Swagger
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Sistema ATS',
      version: '1.0.0',
      description: 'Documentación de la API para el Sistema de Seguimiento de Candidatos (ATS)',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@ejemplo.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Candidato: {
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'telefono'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del candidato',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del candidato',
              example: 'Juan'
            },
            apellido: {
              type: 'string',
              description: 'Apellido del candidato',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              description: 'Correo electrónico del candidato',
              example: 'juan.perez@email.com'
            },
            telefono: {
              type: 'string',
              description: 'Número de teléfono del candidato',
              example: '+34912345678'
            },
            direccion: {
              type: 'string',
              description: 'Dirección del candidato',
              example: 'Calle Ficticia 123, Ciudad'
            },
            educacion: {
              type: 'array',
              description: 'Lista de educación del candidato',
              items: {
                $ref: '#/components/schemas/Educacion'
              }
            },
            experiencia_laboral: {
              type: 'array',
              description: 'Lista de experiencia laboral del candidato',
              items: {
                $ref: '#/components/schemas/ExperienciaLaboral'
              }
            },
            documentos: {
              type: 'array',
              description: 'Lista de documentos del candidato',
              items: {
                $ref: '#/components/schemas/Documento'
              }
            }
          }
        },
        Educacion: {
          type: 'object',
          required: ['institucion', 'titulo', 'fecha_inicio'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la educación',
              example: 1
            },
            institucion: {
              type: 'string',
              description: 'Nombre de la institución educativa',
              example: 'Universidad de Madrid'
            },
            titulo: {
              type: 'string',
              description: 'Título obtenido',
              example: 'Licenciado en Psicología'
            },
            fecha_inicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio de los estudios',
              example: '2015-09-01'
            },
            fecha_fin: {
              type: 'string',
              format: 'date',
              description: 'Fecha de finalización de los estudios',
              example: '2019-06-30'
            }
          }
        },
        ExperienciaLaboral: {
          type: 'object',
          required: ['empresa', 'puesto', 'fecha_inicio'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la experiencia laboral',
              example: 1
            },
            empresa: {
              type: 'string',
              description: 'Nombre de la empresa',
              example: 'Empresa XYZ'
            },
            puesto: {
              type: 'string',
              description: 'Puesto desempeñado',
              example: 'Psicólogo Clínico'
            },
            fecha_inicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del empleo',
              example: '2020-01-01'
            },
            fecha_fin: {
              type: 'string',
              format: 'date',
              description: 'Fecha de finalización del empleo',
              example: '2023-01-01'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de las responsabilidades y logros',
              example: 'Atención a pacientes, diagnóstico y seguimiento.'
            }
          }
        },
        Documento: {
          type: 'object',
          required: ['tipo_documento', 'nombre_archivo', 'ruta_archivo'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del documento',
              example: 1
            },
            tipo_documento: {
              type: 'string',
              description: 'Tipo de documento',
              example: 'CV'
            },
            nombre_archivo: {
              type: 'string',
              description: 'Nombre del archivo',
              example: 'CV_Juan_Perez.pdf'
            },
            ruta_archivo: {
              type: 'string',
              description: 'Ruta del archivo en el servidor',
              example: '/uploads/cv/CV_Juan_Perez.pdf'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error interno del servidor.'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Rutas donde buscar anotaciones de Swagger
};

// Generar especificación de Swagger
const swaggerSpec = swaggerJsdoc(options);

// Función para configurar Swagger en la aplicación Express
export const setupSwagger = (app: any) => {
  // Ruta para la documentación de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Sistema ATS - Documentación'
  }));

  // Ruta para obtener la especificación de Swagger en formato JSON
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('Documentación de Swagger disponible en /api-docs');
};

export default setupSwagger; 