const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  // Log the error for debugging in development
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default errorHandler;