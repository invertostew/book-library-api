const { ValidationError } = require("sequelize");

const { GeneralError } = require("../helpers/general-error");

function errorHandler(err, req, res, next) {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      message: err.message
    });
  }

  if (err instanceof ValidationError) {
    const errors = err.errors.map((error) => error.message);

    return res.status(400).json({
      message: errors
    });
  }

  return res.status(500).json({
    message: err.message
  });
}

module.exports = errorHandler;
