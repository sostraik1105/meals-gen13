const { Router } = require('express');

const ordersRoutes = Router();

// Controllers
const {
    createOrder,
    getUserOrders,
    updateOrders,
    deleteOrders,
} = require('../controllers/orders.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const { orderExists } = require('../middlewares/orders.middleware');

// Routes

ordersRoutes.use(protectSession);

ordersRoutes.post('/', createOrder);

ordersRoutes.get('/me', getUserOrders);

ordersRoutes
    .use('/:orderId', orderExists)
    .route('/:orderId')
    .patch(updateOrders)
    .delete(deleteOrders);

module.exports = { ordersRoutes };
