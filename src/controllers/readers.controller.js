const { Reader } = require("../models");

async function createReader(req, res) {
  try {
    const reader = await Reader.create(req.body);

    res.status(201).json(reader);
  } catch (err) {
    const endpoint = `${req.method} ${req.baseUrl}${req.path}`;

    res.status(400).json({
      errorEndpoint: endpoint,
      errorType: err.errors[0].type,
      errorValue: err.errors[0].value
    });
  }
}

module.exports = {
  createReader
};
