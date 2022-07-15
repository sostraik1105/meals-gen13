const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Models
const { Users } = require('../models/users.model');
const { Orders } = require('../models/orders.model');
const { Restaurants } = require('../models/restaurants.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { errorHandler } = require('../utils/errorHandler.util');
const { Meals } = require('../models/meals.model');

// POST - signUp
exports.signup = errorHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
        name,
        email,
        password: hashPassword,
        role,
    });

    newUser.password = undefined;

    res.status(201).json({ status: 'success', newUser });
});

// POST - login
exports.login = errorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate credentials
    const dbUser = await Users.findOne({
        where: {
            email,
            status: 'active',
        },
    });

    // Validate password
    const validPassword = await bcrypt.compare(password, dbUser.password);

    if (!dbUser || !validPassword) {
        return next(new AppError('Credentials invalid', 400));
    }

    // Generate Token
    const token = await jwt.sign({ id: dbUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token, status: 'success' });
});

// PATCH - update user
exports.updateUser = errorHandler(async (req, res, next) => {
    const { dbUser } = req;
    const { name, email } = req.body;

    await dbUser.update({ name, email });

    res.status(200).json({ status: 'success' });
});

// DELETE - delete user
exports.deleteUser = errorHandler(async (req, res, next) => {
    const { dbUser } = req;

    await dbUser.update({ status: 'inactive' });

    res.status(204).json({ status: 'deleted' });
});

// GET - order for user in session
exports.getOrdersByUser = errorHandler(async (req, res, next) => {
    const { userId } = req.params;

    const orders = await Orders.findAll({
        where: { userId },
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

    res.status(200).json({ orders });
});

// GET - order x orderId
exports.getOrderById = errorHandler(async (req, res, next) => {
    const { id } = req.sessionUser;
    const { orderId } = req.params;

    const order = await Orders.findOne({
        where: { id: orderId, userId: id },
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

    res.status(200).json({ order });
});
