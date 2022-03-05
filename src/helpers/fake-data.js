const { faker } = require("@faker-js/faker");

function dummyReader({
  name = faker.name.findName(),
  email = faker.internet.email()
}) {
  return {
    name,
    email
  };
}

module.exports = {
  dummyReader
};
