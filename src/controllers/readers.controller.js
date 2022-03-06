const { Reader } = require("../models");
const { BadRequest, NotFound } = require("../helpers/general-error");

async function readReaders(req, res, next) {
  try {
    const readers = await Reader.findAll();

    res.status(200).json(readers);
  } catch (err) {
    next(err);
  }
}

async function createReader(req, res, next) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new BadRequest("Missing required fields: 'name' or 'email'");
    }

    const reader = await Reader.create(req.body);

    res.status(201).json(reader);
  } catch (err) {
    next(err);
  }
}

async function readReader(req, res, next) {
  try {
    const { id } = req.params;
    const reader = await Reader.findByPk(id);

    if (!reader) {
      throw new NotFound("The reader could not be found");
    }

    res.status(200).json(reader);
  } catch (err) {
    next(err);
  }
}

async function updateReader(req, res, next) {
  try {
    const { id } = req.params;
    const reader = await Reader.findByPk(id);

    if (!reader) {
      throw new NotFound("The reader could not be found");
    }

    const updatedData = req.body;
    await Reader.update(updatedData, { where: {} });

    res.status(200).json({
      type: "success",
      message: "The reader has been successfully updated"
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  readReaders,
  createReader,
  readReader,
  updateReader
};
