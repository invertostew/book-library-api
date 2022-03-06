const express = require("express");

const readersController = require("../controllers/readers.controller");

const readersRouter = express.Router();

readersRouter
  .route("/")
  .get(readersController.readAllReaders)
  .post(readersController.createNewReader);

readersRouter
  .route("/:id")
  .get(readersController.readSingleReaderById)
  .patch(readersController.updateSingleReaderById)
  .delete(readersController.deleteSingleReaderById);

module.exports = readersRouter;
