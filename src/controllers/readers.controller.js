const crudHelpers = require("./crud-helpers");

function readAllReaders(req, res, next) {
  crudHelpers.readAllItems("reader", res, next);
}

function createNewReader(req, res, next) {
  crudHelpers.createNewItem("reader", req.body, res, next);
}

function readSingleReaderById(req, res, next) {
  crudHelpers.readSingleItemById("reader", req.params.id, res, next);
}

function updateSingleReaderById(req, res, next) {
  crudHelpers.updateSingleItemById(
    "reader",
    req.params.id,
    req.body,
    res,
    next
  );
}

function deleteSingleReaderById(req, res, next) {
  crudHelpers.deleteSingleItemById("reader", req.params.id, res, next);
}

module.exports = {
  readAllReaders,
  createNewReader,
  readSingleReaderById,
  updateSingleReaderById,
  deleteSingleReaderById
};
