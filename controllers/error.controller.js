const sendErrorDev = (err, req, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'fail',
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err, req, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'fail',
        message: err.message || 'Something went very wrong!',
    });
};

const handleUniqueEmailError = () => {
    return new AppError('The email you entered is already taken', 400);
};

const handleJWTExpiredError = () => {
    return new AppError('Your session has expired! please login again.', 401);
};

const handleJWTError = () => {
    return new AppError('invalid session, please login again', 401);
};

exports.globalErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (err.name === 'SequelizeUniqueConstraintError') {
            error = handleUniqueEmailError();
        } else if (err.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        } else if (err.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }

        sendErrorProd(error, req, res);
    }
};
