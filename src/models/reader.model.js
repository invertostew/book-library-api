function ReaderModel(connection, DataTypes) {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    }
  };

  const Reader = connection.define("Reader", schema);

  return Reader;
}

module.exports = ReaderModel;
