import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description:
        'Comprehensive documentation for the API, detailing endpoints, parameters, and responses.',
    },
    tags: [
      {
        name: 'Auth',
        description: 'API operations related to authentication and user management.',
      },
      {
        name: 'Projects',
        description: 'API operations related to projects.',
      },
    ],
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://project-management-backend-kvhy.onrender.com/docs',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
