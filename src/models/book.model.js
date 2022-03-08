function BookModel(connection, DataTypes) {
  const ERROR_MISSING_TITLE = "Missing required field: 'title' 👎";
  const ERROR_ISBN_LENGTH =
    "ISBN must be more than or equal to 10 characters, but less than or equal to 13 characters 👎";

  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: ERROR_MISSING_TITLE
        },
        notEmpty: {
          args: true,
          msg: ERROR_MISSING_TITLE
        }
      }
    },
    ISBN: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10, 13],
          msg: ERROR_ISBN_LENGTH
        }
      }
    }
  };

  const Book = connection.define("Book", schema);

  return Book;
}

module.exports = BookModel;
