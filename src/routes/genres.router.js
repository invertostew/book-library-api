const express = require("express");

const genresController = require("../controllers/genres.controller");

const genresRouter = express.Router();

genresRouter
  .route("/")
  .get(genresController.readAllGenres)
  .post(genresController.createNewGenre);

genresRouter
  .route("/:id")
  .get(genresController.readSingleGenreById)
  .patch(genresController.updateSingleGenreById)
  .delete(genresController.deleteSingleGenreById);

module.exports = genresRouter;
