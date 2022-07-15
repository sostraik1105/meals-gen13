const jwt = require('jsonwebtoken');
const { Users } = require('../models/users.model');
const { AppError } = require('../utils/appError.util');
const { errorHandler } = require('../utils/errorHandler.util');
require('dotenv').config();

exports.protectSession = errorHandler(async (req, res, next) => {
    let token;

    // Extract the token from headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Invalid session', 403));
    }

    // JWT is valid?
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const sessionUser = await Users.findOne({
        where: { id: decoded.id, status: 'active' },
    });

    if (!sessionUser) {
        return next(
            new AppError("The owner of this token doesn't exists anymore", 403)
        );
    }

    // Grant access
    req.sessionUser = sessionUser;

    next();
});

exports.protectOwner = errorHandler(async (req, res, next) => {
    const { dbUser, sessionUser } = req;

    if (sessionUser.id !== dbUser.id) {
        return next(new AppError('You do not own this account', 403));
    }

    next();
});

exports.protectReviewOwner = errorHandler(async (req, res, next) => {
    const { dbReview, sessionUser } = req;

    if (sessionUser.id !== dbReview.userId) {
        return next(new AppError('You do not own this account', 403));
    }

    next();
});

exports.protectAdmin = errorHandler(async (req, res, next) => {
    const { role } = req.sessionUser;

    if (role !== 'admin') {
        return next(new AppError('Access not granted', 403));
    }

    next();
});
