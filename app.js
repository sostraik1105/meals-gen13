const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Routes
const { usersRoutes } = require('./routes/users.routes');
const { restaurantsRoutes } = require('./routes/restaurants.routes');
const { mealsRoutes } = require('./routes/meals.routes');
const { ordersRoutes } = require('./routes/orders.routes');

// Global err controller
const { globalErrorHandler } = require('./controllers/error.controller');

// Utils
const { AppError } = require('./utils/appError.util');

// Initialize express
const app = express();

app.use(express.json());

// Limit the number of request
const limiter = rateLimit({
    max: 10000,
    windowMs: 1 * 60 * 60 * 1000,
    message: 'Number of request hace been exceeded',
});

app.use(limiter);

// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());

// Log incomming request
process.env.NODE_ENV === 'production'
    ? app.use(morgan('combined'))
    : app.use(morgan('dev'));

// Endpoints
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/restaurants', restaurantsRoutes);
app.use('/api/v1/meals', mealsRoutes);
app.use('/api/v1/orders', ordersRoutes);

// Handle incoming unknown routes to the server
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `${req.method} ${req.originalUrl} not found in this server`,
            404
        )
    );
});

app.use(globalErrorHandler);

module.exports = { app };
