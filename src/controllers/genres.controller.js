const crudHelpers = require("./crud-helpers");

function readAllGenres(req, res, next) {
  crudHelpers.readAllItems("genre", res, next, "book");
}

function createNewGenre(req, res, next) {
  crudHelpers.createNewItem("genre", req.body, res, next);
}

function readSingleGenreById(req, res, next) {
  crudHelpers.readSingleItemById("genre", req.params.id, res, next);
}

function updateSingleGenreById(req, res, next) {
  crudHelpers.updateSingleItemById("genre", req.params.id, req.body, res, next);
}

function deleteSingleGenreById(req, res, next) {
  crudHelpers.deleteSingleItemById("genre", req.params.id, res, next);
}

module.exports = {
  readAllGenres,
  createNewGenre,
  readSingleGenreById,
  updateSingleGenreById,
  deleteSingleGenreById
};
