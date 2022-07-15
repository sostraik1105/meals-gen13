const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/appError.util');

const checkResults = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        // Arrays has errors
        const errorMsgs = errors.array().map(err => err.msg);

        const message = errorMsgs.join('. ');

        return next(new AppError(message, 400));
    }

    next();
};

exports.userValidators = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Must provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be a least 8 characters long')
        .isAlphanumeric()
        .withMessage('Password must contain letters and numbers'),
    checkResults,
];

exports.restaurantValidators = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('address').notEmpty().withMessage('Address cannot be empty'),
    body('rating')
        .notEmpty()
        .withMessage('Rating cannot be empty')
        .isNumeric()
        .withMessage('Rating is valid to 1 at 5'),
    checkResults,
];

exports.reviewValidator = [
    body('comment').notEmpty().withMessage('Comment cannot be empty'),
    body('rating')
        .notEmpty()
        .withMessage('Rating cannot be empty')
        .isNumeric()
        .withMessage('Rating is valid to 1 at 5'),
    checkResults,
];

exports.mealValidator = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('price')
        .notEmpty()
        .withMessage('Price cannot be empty')
        .isInt()
        .withMessage('Price must be integer'),
];

exports.orderValidator = [
    body('quantity')
        .notEmpty()
        .withMessage('Quantity cannot be empty')
        .isInt()
        .withMessage('Quantity must be integer'),
    body('mealId')
        .notEmpty()
        .withMessage('Id meal cannot be empty')
        .isInt()
        .withMessage('Id meal must be integer'),
];
