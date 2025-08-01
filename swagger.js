const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Money Manager API',
      version: '1.0.0',
      description: 'API documentation for Money Manager application',
    },
    servers: [
      {
        url: 'http://localhost:3055/v1',
        description: 'Development server',
      },
    ],
    components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication',
                },
                ClientIdHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-client-id',
                    description: 'Unique identifier for the client/user'
                },
                Authorization: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'athorization',
                    description: 'Token'
                }
            }
        },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/routes/*/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
}; 