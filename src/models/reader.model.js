function ReaderModel(connection, DataTypes) {
  const ERROR_MISSING_NAME = "Missing required field: 'name' 👎";
  const ERROR_MISSING_EMAIL = "Missing required field: 'email' 👎";
  const ERROR_MISSING_PASSWORD = "Missing required field: 'password' 👎";
  const ERROR_INVALID_EMAIL = "You have provided an invalid email format 👎";
  const ERROR_PASSWORD_LENGTH =
    "Password must be more than 8 characters, but less than 64 characters 👎";

  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: ERROR_MISSING_NAME
        },
        notEmpty: {
          args: true,
          msg: ERROR_MISSING_NAME
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: ERROR_MISSING_EMAIL
        },
        notEmpty: {
          args: true,
          msg: ERROR_MISSING_EMAIL
        },
        isEmail: {
          args: true,
          msg: ERROR_INVALID_EMAIL
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: ERROR_MISSING_PASSWORD
        },
        notEmpty: {
          args: true,
          msg: ERROR_MISSING_PASSWORD
        },
        len: {
          args: [8, 64],
          msg: ERROR_PASSWORD_LENGTH
        }
      }
    }
  };

  const Reader = connection.define("Reader", schema);

  return Reader;
}

module.exports = ReaderModel;
