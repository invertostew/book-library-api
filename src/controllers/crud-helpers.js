const { Reader, Book } = require("../models");
const removeObjectProperty = require("../helpers/remove-object-property");
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
    const itemsWithoutPassword = items.map((item) => {
      return removeObjectProperty("password", item.dataValues);
    });

    res.status(200).json(itemsWithoutPassword);
  } catch (err) {
    next(err);
  }
}

async function createNewItem(model, body, res, next) {
  const Model = getModel(model);

  try {
    const newItem = await Model.create(body);
    const newItemWithoutPassword = removeObjectProperty(
      "password",
      newItem.dataValues
    );

    res.status(201).json(newItemWithoutPassword);
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

    const itemWithoutPassword = removeObjectProperty(
      "password",
      item.dataValues
    );

    res.status(200).json(itemWithoutPassword);
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
