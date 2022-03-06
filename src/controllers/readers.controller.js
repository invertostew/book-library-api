const { Reader } = require("../models");
const validateEmail = require("../helpers/validate-email");
const { BadRequest, NotFound } = require("../helpers/general-error");

async function readAllReaders(req, res, next) {
  try {
    const readers = await Reader.findAll();

    res.status(200).json(readers);
  } catch (err) {
    next(err);
  }
}

async function createNewReader(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequest(
        "Missing required fields: 'name', 'email' or 'password'"
      );
    }

    if (email && !validateEmail(email)) {
      throw new BadRequest("You have provided an invalid email format");
    }

    if (password && password.length < 8) {
      throw new BadRequest("Password length must be greater than 8 characters");
    }

    const reader = await Reader.create(req.body);

    res.status(201).json(reader);
  } catch (err) {
    next(err);
  }
}

async function readSingleReaderById(req, res, next) {
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

async function updateSingleReaderById(req, res, next) {
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

async function deleteSingleReaderById(req, res, next) {
  try {
    const { id } = req.params;
    const reader = await Reader.findByPk(id);

    if (!reader) {
      throw new NotFound("The reader could not be found");
    }

    await Reader.destroy({ where: { id } });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  readAllReaders,
  createNewReader,
  readSingleReaderById,
  updateSingleReaderById,
  deleteSingleReaderById
};
