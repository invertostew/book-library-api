const { Reader, Book } = require("../models");
const { NotFound } = require("../helpers/general-error");

function getModel(model) {
  const models = {
    reader: Reader,
    book: Book
  };

  return models[model];
}

async function readAllItems(model, res, next) {
  const Model = getModel(model);

  try {
    const items = await Model.findAll();

    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}

async function createNewItem(model, body, res, next) {
  const Model = getModel(model);

  try {
    const newItem = await Model.create(body);

    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
}

async function readSingleItemById(model, id, res, next) {
  const Model = getModel(model);

  try {
    const item = await Model.findByPk(id);

    if (!item) {
      throw new NotFound(`The ${model} could not be found 💥`);
    }

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateSingleItemById(model, id, body, res, next) {
  const Model = getModel(model);

  try {
    const item = await Model.findByPk(id);

    if (!item) {
      throw new NotFound(`The ${model} could not be found 💥`);
    }

    const updatedData = body;
    await Model.update(updatedData, { where: {} });

    res.status(200).json({
      message: `The ${model} has been successfully updated 👍`
    });
  } catch (err) {
    next(err);
  }
}

async function deleteSingleItemById(model, id, res, next) {
  const Model = getModel(model);

  try {
    const item = await Model.findByPk(id);

    if (!item) {
      throw new NotFound(`The ${model} could not be found 💥`);
    }

    await Model.destroy({ where: { id } });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  readAllItems,
  createNewItem,
  readSingleItemById,
  updateSingleItemById,
  deleteSingleItemById
};
