const errorHandler = (err, req, res, next) => {     // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];

    // if (err.name === "CastError") {
    //     const message = `Invalid ${err.path}`;
    //     err = new ErrorHandler(message, 400);
    //   }
    //   if (err.name === "JsonWebTokenError") {
    //     const message = `Json Web Token is invalid, Try again.`;
    //     err = new ErrorHandler(message, 400);
    //   }
    
    //   if (err.name === "TokenExpiredError") {
    //     const message = `Json Web Token is expired, Try again.`;
    //     err = new ErrorHandler(message, 400);
    //   }
    
    //   if (err.code === 11000) {
    //     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    //     err = new ErrorHandler(message, 400);
    //   }
    

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
}; 

export default errorHandler;