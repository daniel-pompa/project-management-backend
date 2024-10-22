import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
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
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
