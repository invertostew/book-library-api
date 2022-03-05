const { GeneralError } = require("../helpers/general-error");

function errorHandler(err, req, res, next) {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      type: "error",
      message: err.message
    });
  }

  return res.status(500).json({
    type: "error",
    message: err.message
  });
}

module.exports = errorHandler;
