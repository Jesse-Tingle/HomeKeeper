const errorHandler = (error, req, res, next) => {
    const statusCode =
        error.statusCode ||
        error.status ||
        500;

    if (process.env.NODE_ENV !== "test") {
        console.error(
            `${req.method} ${req.originalUrl}`,
            error,
        );
    }

    return res.status(statusCode).json({
        error:
            statusCode === 500
                ? "Internal server error"
                : error.message,
    });
};

module.exports = errorHandler;