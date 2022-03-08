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
  ISBN = faker.lorem.word(13),
  readerId,
  genreId
}) {
  return {
    title,
    ISBN,
    readerId,
    genreId
  };
}

function dummyAuthor({ author = faker.name.findName() }) {
  return { author };
}

function dummyGenre({ genre = faker.lorem.words(2) }) {
  return { genre };
}

module.exports = {
  dummyReader,
  dummyBook,
  dummyAuthor,
  dummyGenre
};
