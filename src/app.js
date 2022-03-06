const express = require("express");

const readersRouter = require("./routes/readers.router");
const booksRouter = require("./routes/books.router");
const errorHandler = require("./middleware/error-handler.middleware");

const app = express();

app.use(express.json());

app.use("/readers", readersRouter);
app.use("/books", booksRouter);

app.use(errorHandler);

module.exports = app;
