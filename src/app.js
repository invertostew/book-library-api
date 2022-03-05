const express = require("express");

const readersRouter = require("./routes/readers.router");

const app = express();

app.use(express.json());

app.use("/readers", readersRouter);

module.exports = app;
