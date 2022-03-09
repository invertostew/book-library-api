const Sequelize = require("sequelize");

const ReaderModel = require("./reader.model");
const AuthorModel = require("./author.model");
const GenreModel = require("./genre.model");
const BookModel = require("./book.model");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

function setUpTables() {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false
  });

  const Reader = ReaderModel(connection, Sequelize);
  const Author = AuthorModel(connection, Sequelize);
  const Genre = GenreModel(connection, Sequelize);
  const Book = BookModel(connection, Sequelize);

  Reader.hasMany(Book, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });

  Author.hasMany(Book, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });

  Genre.hasMany(Book, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
  });

  Book.belongsTo(Author, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });

  Book.belongsTo(Genre, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });

  connection.sync({ alter: true });

  return { Reader, Author, Genre, Book };
}

module.exports = setUpTables();
