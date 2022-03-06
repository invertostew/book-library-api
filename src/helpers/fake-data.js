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

function dummyBook({
  title = faker.lorem.words(),
  author = faker.name.findName(),
  genre = faker.lorem.words(),
  ISBN = faker.lorem.words()
}) {
  return {
    title,
    author,
    genre,
    ISBN
  };
}

module.exports = {
  dummyReader,
  dummyBook
};
