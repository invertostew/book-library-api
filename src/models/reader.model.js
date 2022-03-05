function ReaderModel(connection, DataTypes) {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  };

  const Reader = connection.define("Reader", schema);

  return Reader;
}

module.exports = ReaderModel;
