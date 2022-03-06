const { faker } = require("@faker-js/faker");

function dummyReader({
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
}) {
  return {
    name,
    email,
    password
  };
}

module.exports = {
  dummyReader
};
