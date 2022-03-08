function AuthorModel(connection, DataTypes) {
  const ERROR_UNIQUE_AUTHOR = "The 'author' field must be unique 👎";
  const ERROR_MISSING_AUTHOR = "Missing required field: 'author' 👎";

  const schema = {
    author: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: ERROR_UNIQUE_AUTHOR
      },
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
    }
  };

  const Author = connection.define("Author", schema);

  return Author;
}

module.exports = AuthorModel;
