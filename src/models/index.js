const Sequelize = require("sequelize");

const ReaderModel = require("./reader.model");
const BookModel = require("./book.model");
const AuthorModel = require("./author.model");
const GenreModel = require("./genre.model");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

function setUpTables() {
  const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false
  });

  const Reader = ReaderModel(connection, Sequelize);
  const Book = BookModel(connection, Sequelize);
  const Author = AuthorModel(connection, Sequelize);
  const Genre = GenreModel(connection, Sequelize);

  Reader.hasMany(Book);
  Genre.hasMany(Book);

  Book.belongsTo(Genre);

  connection.sync({ alter: true });

  return { Reader, Book, Author, Genre };
}

module.exports = setUpTables();
