const { Router } = require('express');

// Controllers
const {
    getAllMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    createMeals,
} = require('../controllers/meals.controller');

// Middlewares
const {
    protectSession,
    protectAdmin,
} = require('../middlewares/auth.middleware');
const { mealExists } = require('../middlewares/meals.middleware');
const { restaurantExists } = require('../middlewares/restaurants.middleware');
const { mealValidator } = require('../middlewares/validators.middleware');

// Routes
const mealsRoutes = Router();

mealsRoutes.get('/', getAllMeals);

mealsRoutes.get('/:mealId', mealExists, getMealById);

mealsRoutes.use(protectSession);

mealsRoutes.post(
    '/:restaurantId',
    restaurantExists,
    mealValidator,
    createMeals
);

mealsRoutes
    .use('/:mealId', protectAdmin, mealExists)
    .route('/:mealId')
    .patch(updateMeal)
    .delete(deleteMeal);

module.exports = { mealsRoutes };
