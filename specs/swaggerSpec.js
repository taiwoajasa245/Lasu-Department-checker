
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LASU Course API ',
      version: '1.0.0',
      description: 'get the list of all courses with the Course Title , Course Code , The UNIT of the course , LEVEL, Course Status',
    },
  },
  apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
