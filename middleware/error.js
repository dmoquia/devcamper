const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (error, req, res, next) => {
  let err = { ...error };

  err.message = error.message;
  // log console for devv
  // console.log(error.stack.red);
  console.log(err);

  // mongoose bad object id
  if (error.name === "CastError") {
    const message = `Resource not found`;
    err = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const message = "Duplicate field value entered";
    err = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (error.name === "ValidatorError") {
    const message = Object.values(err.error).map((val) => val.message);
    err = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,

    error: err.message || "Server Error",
  });
};

module.exports = errorHandler;
