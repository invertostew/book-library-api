const crudHelpers = require("./crud-helpers");

function readAllAuthors(req, res, next) {
  crudHelpers.readAllItems("author", res, next, "book");
}

function createNewAuthor(req, res, next) {
  crudHelpers.createNewItem("author", req.body, res, next);
}

function readSingleAuthorById(req, res, next) {
  crudHelpers.readSingleItemById("author", req.params.id, res, next);
}

function updateSingleAuthorById(req, res, next) {
  crudHelpers.updateSingleItemById(
    "author",
    req.params.id,
    req.body,
    res,
    next
  );
}

function deleteSingleAuthorById(req, res, next) {
  crudHelpers.deleteSingleItemById("author", req.params.id, res, next);
}

module.exports = {
  readAllAuthors,
  createNewAuthor,
  readSingleAuthorById,
  updateSingleAuthorById,
  deleteSingleAuthorById
};
