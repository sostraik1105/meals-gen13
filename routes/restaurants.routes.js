const { Router } = require('express');

const restaurantsRoutes = Router();

// Controller
const {
    updateRestaurant,
    createRestaurant,
    createReview,
    deleteRestaurant,
    deleteReview,
    getAllRestaurants,
    getRestaurantById,
    updateReview,
} = require('../controllers/restaurants.controller');

// Middlewares
const {
    protectSession,
    protectAdmin,
    protectOwner,
    protectReviewOwner,
} = require('../middlewares/auth.middleware');
const { restaurantExists } = require('../middlewares/restaurants.middleware');
const { reviewExists } = require('../middlewares/reviews.middleware');
const {
    restaurantValidators,
    reviewValidator,
} = require('../middlewares/validators.middleware');

// Routes
restaurantsRoutes.get('/', getAllRestaurants);

restaurantsRoutes.get('/:restaurantId', restaurantExists, getRestaurantById);

restaurantsRoutes.use(protectSession);

restaurantsRoutes.post('/', restaurantValidators, createRestaurant);

restaurantsRoutes.post(
    '/reviews/:restaurantId',
    restaurantExists,
    reviewValidator,
    createReview
);

restaurantsRoutes
    .use('/reviews/:reviewId', reviewExists, protectReviewOwner)
    .route('/reviews/:reviewId')
    .patch(updateReview)
    .delete(deleteReview);

restaurantsRoutes
    .use('/:restaurantId', protectAdmin, restaurantExists)
    .route('/:restaurantId')
    .patch(updateRestaurant)
    .delete(deleteRestaurant);

module.exports = { restaurantsRoutes };
