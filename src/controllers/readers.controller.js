const { Reader } = require("../models");

async function readReaders(req, res) {
  try {
    const readers = await Reader.findAll();

    res.status(200).json(readers);
  } catch (err) {
    res.status(500).json(err);
  }
}

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
  readReaders,
  createReader
};
