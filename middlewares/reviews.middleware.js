// Models
const { Reviews } = require('../models/reviews.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');
const { AppError } = require('../utils/appError.util');

exports.reviewExists = errorHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const dbReview = await Reviews.findOne({
        where: { id: reviewId, status: 'active' },
    });

    if (!dbReview) {
        return next(new AppError('Review not found', 404));
    }

    req.dbReview = dbReview;

    next();
});
