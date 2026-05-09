const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();

app.use(express.json());

// Serve Swagger UI at the /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API Routes
app.use('/', schoolRoutes);

// Catch-all 404 route
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Route not found" });
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;