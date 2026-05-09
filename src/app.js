const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// API Routes
app.use('/', schoolRoutes);

// Catch-all 404 route
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Route not found" });
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;