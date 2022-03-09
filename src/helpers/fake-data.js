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
  ReaderId = null,
  AuthorId = null,
  GenreId = null
}) {
  return {
    title,
    ISBN,
    ReaderId,
    AuthorId,
    GenreId
  };
}

function dummyAuthor({ author = faker.name.findName(), Books = [] }) {
  return {
    author,
    Books
  };
}

function dummyGenre({ genre = faker.lorem.words(2), Books = [] }) {
  return {
    genre,
    Books
  };
}

module.exports = {
  dummyReader,
  dummyBook,
  dummyAuthor,
  dummyGenre
};
