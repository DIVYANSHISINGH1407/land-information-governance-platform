function errorMiddleware(error, req, res, next) {
  console.error(error);

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "An unexpected server error occurred.";

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body must contain valid JSON.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((fieldError) => fieldError.message)
      .join("; ");
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${error.path}.`;
  }

  if (error.code === 11000) {
    statusCode = 409;
    const fieldName = Object.keys(error.keyValue || {})[0] || "field";
    message = `A record with this ${fieldName} already exists.`;
  }

  if (
    error.name === "MongoServerSelectionError" ||
    error.name === "MongoNetworkError"
  ) {
    statusCode = 503;
    message = "The database is temporarily unavailable.";
  }

  if (process.env.NODE_ENV === "production" && statusCode >= 500) {
    message = "An unexpected server error occurred.";
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = errorMiddleware;
