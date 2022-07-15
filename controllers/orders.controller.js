// Models
const { Meals } = require('../models/meals.model');
const { Orders } = require('../models/orders.model');
const { Restaurants } = require('../models/restaurants.model');

// Middlewares
const { AppError } = require('../utils/appError.util');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');

// POST - create new order
exports.createOrder = errorHandler(async (req, res, next) => {
    const { id } = req.sessionUser;
    const { quantity, mealId } = req.body;

    const dbMeal = await Meals.findOne({
        where: { id: mealId, status: 'active' },
    });

    if (!dbMeal) {
        return next(new AppError('Meal not found', 404));
    }

    const newOrder = await Orders.create({
        mealId,
        userId: id,
        price: dbMeal.price * quantity,
        quantity,
    });

    res.status(201).json({ status: 'success', newOrder });
});

// GET - get my orders
exports.getUserOrders = errorHandler(async (req, res, next) => {
    const { id } = req.sessionUser;

    const userOrders = await Orders.findAll({
        where: { userId: id },
        attributes: {
            exclude: ['mealId', 'userId'],
        },
        include: {
            model: Meals,
            attributes: ['name', 'price'],
            include: {
                model: Restaurants,
                attributes: ['id', 'name'],
            },
        },
    });

    res.status(200).json({ userOrders });
});

// PATCH - update order
exports.updateOrders = errorHandler(async (req, res, next) => {
    const { dbOrder } = req;

    await dbOrder.update({ status: 'completed' });

    res.status(200).json({ status: 'success' });
});

// PATCH - delete order
exports.deleteOrders = errorHandler(async (req, res, next) => {
    const { dbOrder } = req;

    await dbOrder.update({ status: 'cancelled' });

    res.status(200).json({ status: 'success' });
});
