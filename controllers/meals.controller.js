// Models
const { Meals } = require('../models/meals.model');
const { Restaurants } = require('../models/restaurants.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');

// POST - create meals at the restaurant
exports.createMeals = errorHandler(async (req, res, next) => {
    const { name, price } = req.body;
    const { id } = req.dbRestaurant;

    const newMeal = await Meals.create({
        name,
        price,
        restaurantId: id,
    });

    res.status(201).json({ status: 'success', newMeal });
});

// GET - get all meals
exports.getAllMeals = errorHandler(async (req, res, next) => {
    const meals = await Meals.findAll({
        where: { status: 'active' },
        attributes: { exclude: ['restaurantId'] },
        include: {
            model: Restaurants,
            attributes: ['id', 'name'],
        },
    });

    res.status(200).json({ meals });
});

// GET - find meal by id
exports.getMealById = errorHandler(async (req, res, next) => {
    const { dbMeal } = req;

    res.status(200).json({ dbMeal });
});

// PATCH - update meal
exports.updateMeal = errorHandler(async (req, res, next) => {
    const { dbMeal } = req;
    const { name, price } = req.body;

    await dbMeal.update({ name, price });

    res.status(200).json({ status: 'success' });
});

// DELETE - delete meal
exports.deleteMeal = errorHandler(async (req, res, next) => {
    const { dbMeal } = req;

    await dbMeal.update({ status: 'inactive' });

    res.status(200).json({ status: 'deleted' });
});
