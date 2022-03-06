const express = require("express");

const booksController = require("../controllers/books.controller");

const booksRouter = express.Router();

booksRouter
  .route("/")
  .get(booksController.readAllBooks)
  .post(booksController.createNewBook);

booksRouter
  .route("/:id")
  .get(booksController.readSingleBookById)
  .patch(booksController.updateSingleBookById)
  .delete(booksController.deleteSingleBookById);

module.exports = booksRouter;
