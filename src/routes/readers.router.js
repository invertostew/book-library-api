const express = require("express");

const readersController = require("../controllers/readers.controller");

const readersRouter = express.Router();

readersRouter.post("/", readersController.createReader);

module.exports = readersRouter;
