const express = require("express");

const helmet = require("helmet");

const readersRouter = require("./routes/readers.router");
const booksRouter = require("./routes/books.router");
const authorsRouter = require("./routes/authors.router");
const genresRouter = require("./routes/genres.router");
const errorHandler = require("./middleware/error-handler.middleware");

const app = express();

app.use(express.json());
app.use(helmet());

app.use("/readers", readersRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);

app.use(errorHandler);

module.exports = app;
