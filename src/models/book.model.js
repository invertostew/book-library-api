function BookModel(connection, DataTypes) {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
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
