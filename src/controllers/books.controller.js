const { Book } = require("../models");
const { BadRequest, NotFound } = require("../helpers/general-error");

async function readAllBooks(req, res, next) {
  try {
    const books = await Book.findAll();

    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
}

async function createNewBook(req, res, next) {
  try {
    const { title, author } = req.body;

    if (!title || !author) {
      throw new BadRequest("Missing required fields: 'title' or 'author'");
    }

    const book = await Book.create(req.body);

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}

async function readSingleBookById(req, res, next) {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      throw new NotFound("The book could not be found");
    }

    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
}

async function updateSingleBookById(req, res, next) {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      throw new NotFound("The book could not be found");
    }

    const updatedData = req.body;
    await Book.update(updatedData, { where: {} });

    res.status(200).json({
      type: "success",
      message: "The book has been successfully updated"
    });
  } catch (err) {
    next(err);
  }
}

async function deleteSingleBookById(req, res, next) {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      throw new NotFound("The book could not be found");
    }

    await Book.destroy({ where: { id } });

    res.status(204).json({
      type: "success",
      message: "The book has been successfully deleted"
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  readAllBooks,
  createNewBook,
  readSingleBookById,
  updateSingleBookById,
  deleteSingleBookById
};
