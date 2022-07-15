const { Router } = require('express');

const usersRoutes = Router();

// Controllers
const {
    signup,
    login,
    deleteUser,
    getOrderById,
    getOrdersByUser,
    updateUser,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middleware');
const {
    protectSession,
    protectOwner,
} = require('../middlewares/auth.middleware');
const { userValidators } = require('../middlewares/validators.middleware');
const { orderExists } = require('../middlewares/orders.middleware');

usersRoutes.post('/signup', userValidators, signup);

usersRoutes.post('/login', login);

usersRoutes.use(protectSession);

usersRoutes.get('/orders/:userId', getOrdersByUser);

usersRoutes.get('/orders/:orderId', orderExists, getOrderById);

usersRoutes
    .use('/:userId', userExists, protectOwner)
    .route('/:userId')
    .patch(updateUser)
    .delete(deleteUser);

module.exports = { usersRoutes };
