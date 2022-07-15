// Models
const { Meals } = require('../models/meals.model');
const { Restaurants } = require('../models/restaurants.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');
const { AppError } = require('../utils/appError.util');

exports.mealExists = errorHandler(async (req, res, next) => {
    const { mealId } = req.params;
    const dbMeal = await Meals.findOne({
        where: { id: mealId, status: 'active' },
        attributes: { exclude: ['restaurantId'] },
        include: {
            model: Restaurants,
            attributes: ['id', 'name'],
        },
    });

    if (!dbMeal) {
        return next(new AppError('Meal not found', 404));
    }

    req.dbMeal = dbMeal;

    next();
});
