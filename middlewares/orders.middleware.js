// Models
const { Orders } = require('../models/orders.model');

// Utils
const { errorHandler } = require('../utils/errorHandler.util');
const { AppError } = require('../utils/appError.util');

exports.orderExists = errorHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const dbOrder = await Orders.findOne({
        where: { id: orderId, status: 'active' },
    });

    if (!dbOrder) {
        return next(new AppError('Order not found', 404));
    }

    req.dbOrder = dbOrder;

    next();
});
