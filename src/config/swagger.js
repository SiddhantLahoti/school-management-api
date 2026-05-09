const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'School Management API',
            version: '1.0.0',
            description: 'API for managing school data and finding nearby schools based on proximity.',
        },
        tags: [
            {
                name: 'Schools',
                description: 'API endpoints for managing schools',
            },
        ],
        servers: [
            {
                url: '/',
                description: 'API Server Root',
            },
        ],
    },
    // Path to the files containing OpenAPI definitions (your routes)
    apis: [path.resolve(__dirname, '../routes/schoolRoutes.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;