// Models
const { Restaurants } = require('../models/restaurants.model');
const { Reviews } = require('../models/reviews.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');

// POST - new restaurant
exports.createRestaurant = errorHandler(async (req, res, next) => {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurants.create({
        name,
        address,
        rating,
    });

    res.status(201).json({ status: 'success', newRestaurant });
});

// GET - get all restaurant
exports.getAllRestaurants = errorHandler(async (req, res, next) => {
    const restaurants = await Restaurants.findAll({
        where: { status: 'active' },
    });

    res.status(200).json({ restaurants });
});

// GET - get restaurant by id
exports.getRestaurantById = errorHandler(async (req, res, next) => {
    const { dbRestaurant } = req;

    res.status(200).json({ dbRestaurant });
});

// PATCH - update restaurant
exports.updateRestaurant = errorHandler(async (req, res, next) => {
    const { dbRestaurant } = req;
    const { name, address } = req.body;

    await dbRestaurant.update({ name, address });

    res.status(200).json({ status: 'success' });
});

// DELETE - delete restaurant
exports.deleteRestaurant = errorHandler(async (req, res, next) => {
    const { dbRestaurant } = req;

    await dbRestaurant.update({ status: 'inactive' });

    res.status(200).json({ status: 'deleted' });
});

// POST - create review to restaurant
exports.createReview = errorHandler(async (req, res, next) => {
    const { dbRestaurant, sessionUser } = req;
    const { comment, rating } = req.body;

    const newReview = await Reviews.create({
        userId: sessionUser.id,
        comment,
        restaurantId: dbRestaurant.id,
        rating,
    });

    res.status(201).json({ status: 'success', newReview });
});

// PATCH - update review
exports.updateReview = errorHandler(async (req, res, next) => {
    const { dbReview } = req;
    const { comment, rating } = req.body;

    await dbReview.update({ comment, rating });

    res.status(200).json({ status: 'success', dbReview });
});

// DELETE - delete review
exports.deleteReview = errorHandler(async (req, res, next) => {
    const { dbReview } = req;

    await dbReview.update({ status: 'deleted' });

    res.status(200).json({ status: 'deleted' });
});
