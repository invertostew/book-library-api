const { describe, it, before, beforeEach } = require("mocha");
const { expect } = require("chai");
const supertest = require("supertest");

const { Reader, Author, Genre, Book } = require("../../models/index");
const fakeData = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("/books", function () {
  before(async function () {
    await Promise.all([
      Reader.sequelize.sync(),
      Author.sequelize.sync(),
      Genre.sequelize.sync(),
      Book.sequelize.sync()
    ]);
  });

  beforeEach(async function () {
    await Promise.all([
      Reader.destroy({ where: {} }),
      Author.destroy({ where: {} }),
      Genre.destroy({ where: {} }),
      Book.destroy({ where: {} })
    ]);
  });

  describe("association tests", function () {
    let readers;
    let authors;
    let genres;
    let books;

    beforeEach(async function () {
      readers = await Promise.all([
        Reader.create(fakeData.dummyReader({})),
        Reader.create(fakeData.dummyReader({})),
        Reader.create(fakeData.dummyReader({}))
      ]);

      authors = await Promise.all([
        Author.create(fakeData.dummyAuthor({})),
        Author.create(fakeData.dummyAuthor({})),
        Author.create(fakeData.dummyAuthor({}))
      ]);

      genres = await Promise.all([
        Genre.create(fakeData.dummyGenre({})),
        Genre.create(fakeData.dummyGenre({})),
        Genre.create(fakeData.dummyGenre({}))
      ]);

      books = await Promise.all([
        Book.create(
          fakeData.dummyBook({
            ReaderId: readers[0].id,
            AuthorId: authors[2].id,
            GenreId: genres[0].id
          })
        ),
        Book.create(
          fakeData.dummyBook({
            ReaderId: readers[1].id,
            AuthorId: authors[0].id,
            GenreId: genres[1].id
          })
        ),
        Book.create(
          fakeData.dummyBook({
            ReaderId: readers[1].id,
            AuthorId: authors[1].id,
            GenreId: genres[2].id
          })
        )
      ]);
    });

    describe("GET /books", function () {
      it("returns an array of books with the correct ReaderId, AuthorId and GenreId values", async function () {
        const res = await req.get("/books");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((book) => {
          const expected = books.find((b) => b.id === book.id);

          expect(book.ReaderId).to.equal(expected.ReaderId);
          expect(book.AuthorId).to.equal(expected.AuthorId);
          expect(book.GenreId).to.equal(expected.GenreId);
        });
      });
    });
  });
});