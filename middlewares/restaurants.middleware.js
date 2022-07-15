// Models
const { Restaurants } = require('../models/restaurants.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');
const { AppError } = require('../utils/appError.util');

exports.restaurantExists = errorHandler(async (req, res, next) => {
    const { restaurantId } = req.params;
    const dbRestaurant = await Restaurants.findOne({
        where: { id: restaurantId, status: 'active' },
    });

    if (!dbRestaurant) {
        return next(new AppError('Restaurant not found', 404));
    }

    req.dbRestaurant = dbRestaurant;

    next();
});
