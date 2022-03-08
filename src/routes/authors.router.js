const express = require("express");

const authorsController = require("../controllers/authors.controller");

const authorsRouter = express.Router();

authorsRouter
  .route("/")
  .get(authorsController.readAllAuthors)
  .post(authorsController.createNewAuthor);

authorsRouter
  .route("/:id")
  .get(authorsController.readSingleAuthorById)
  .patch(authorsController.updateSingleAuthorById)
  .delete(authorsController.deleteSingleAuthorById);

module.exports = authorsRouter;
