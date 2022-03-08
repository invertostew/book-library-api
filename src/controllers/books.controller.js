const crudHelpers = require("./crud-helpers");

function readAllBooks(req, res, next) {
  crudHelpers.readAllItems("book", res, next);
}

function createNewBook(req, res, next) {
  crudHelpers.createNewItem("book", req.body, res, next);
}

function readSingleBookById(req, res, next) {
  crudHelpers.readSingleItemById("book", req.params.id, res, next, "genre");
}

function updateSingleBookById(req, res, next) {
  crudHelpers.updateSingleItemById("book", req.params.id, req.body, res, next);
}

function deleteSingleBookById(req, res, next) {
  crudHelpers.deleteSingleItemById("book", req.params.id, res, next);
}

module.exports = {
  readAllBooks,
  createNewBook,
  readSingleBookById,
  updateSingleBookById,
  deleteSingleBookById
};
