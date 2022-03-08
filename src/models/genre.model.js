function GenreModel(connection, DataTypes) {
  const ERROR_UNIQUE_GENRE = "The 'genre' field must be unique 👎";
  const ERROR_MISSING_GENRE = "Missing required field: 'genre' 👎";

  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: ERROR_UNIQUE_GENRE
      },
      validate: {
        notNull: {
          args: true,
          msg: ERROR_MISSING_GENRE
        },
        notEmpty: {
          args: true,
          msg: ERROR_MISSING_GENRE
        }
      }
    }
  };

  const Genre = connection.define("Genre", schema);

  return Genre;
}

module.exports = GenreModel;
