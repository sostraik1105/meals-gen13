// Models
const { Users } = require('../models/users.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');
const { AppError } = require('../utils/appError.util');

exports.userExists = errorHandler(async (req, res, next) => {
    const { userId } = req.params;
    const dbUser = await Users.findOne({
        where: { id: userId, status: 'active' },
    });

    if (!dbUser) {
        return next(new AppError('User not found', 404));
    }

    req.dbUser = dbUser;

    next();
});
