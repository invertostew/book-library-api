function BookModel(connection, DataTypes) {
  const ERROR_MISSING_TITLE = "Missing required field: 'title' 👎";
  const ERROR_MISSING_AUTHOR = "Missing required field: 'author' 👎";

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
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: ERROR_MISSING_AUTHOR
        },
        notEmpty: {
          args: true,
          msg: ERROR_MISSING_AUTHOR
        }
      }
    },
    genre: {
      type: DataTypes.STRING
    },
    ISBN: {
      type: DataTypes.STRING
    }
  };

  const Book = connection.define("Book", schema);

  return Book;
}

module.exports = BookModel;
