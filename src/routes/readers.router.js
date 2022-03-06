const express = require("express");

const readersController = require("../controllers/readers.controller");

const readersRouter = express.Router();

readersRouter
  .route("/")
  .get(readersController.readReaders)
  .post(readersController.createReader);

readersRouter
  .route("/:id")
  .get(readersController.readReader)
  .patch(readersController.updateReader)
  .delete(readersController.deleteReader);

module.exports = readersRouter;
