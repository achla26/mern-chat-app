const errorHandler = (err, req, res, next) => {     // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};

export default errorHandler;