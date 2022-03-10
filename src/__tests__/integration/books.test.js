const { describe, it, before, beforeEach } = require("mocha");
const { expect } = require("chai");
const supertest = require("supertest");

const { Book, Author } = require("../../models/index");
const { dummyBook, dummyAuthor } = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("books.controller", function () {
  before(async function () {
    await Promise.all([Book.sequelize.sync(), Author.sequelize.sync()]);
  });

  let author;

  beforeEach(async function () {
    await Book.destroy({ where: {} });
    await Author.destroy({ where: {} });

    // Book MUST have an Author (for AuthorId), so set one up.
    author = await Author.create(dummyAuthor({}));
  });

  describe("without records in the database", function () {
    describe("createNewBook - POST /books", function () {
      it("creates a new book in the database", async function () {
        const bookReqBody = dummyBook({ AuthorId: author.id });
        const res = await req.post("/books").send(bookReqBody);
        const book = await Book.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(book.title).to.equal(bookReqBody.title);
        expect(book.ISBN).to.equal(bookReqBody.ISBN);
      });

      it("returns a 400 if the request body is empty", async function () {
        const res = await req.post("/books").send({});

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'title' 👎",
          "Missing required field: 'AuthorId' 👎"
        ]);
      });

      it("returns a 400 if the request body is missing title", async function () {
        const { ISBN, AuthorId } = dummyBook({ AuthorId: author.id });
        const res = await req.post("/books").send({ ISBN, AuthorId });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'title' 👎"]);
      });

      it("returns a 400 if the ISBN is less than 10 characters", async function () {
        const book = dummyBook({ ISBN: "short", AuthorId: author.id });
        const res = await req.post("/books").send(book);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "ISBN must be more than or equal to 10 characters, but less than or equal to 13 characters 👎"
        ]);
      });

      it("returns a 400 if the ISBN is more than 13 characters", async function () {
        const book = dummyBook({
          ISBN: "iammorethan13characters",
          AuthorId: author.id
        });
        const res = await req.post("/books").send(book);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "ISBN must be more than or equal to 10 characters, but less than or equal to 13 characters 👎"
        ]);
      });

      it("returns a 400 if the ISBN is not unique", async function () {
        const bookReqBody = dummyBook({ AuthorId: author.id });
        await req.post("/books").send(bookReqBody);
        const res = await req.post("/books").send(bookReqBody);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["The 'ISBN' field must be unique 👎"]);
      });
    });
  });

  describe("with records in the database", function () {
    let books;

    beforeEach(async function () {
      books = await Promise.all([
        Book.create(dummyBook({ ISBN: "1234567890", AuthorId: author.id })),
        Book.create(dummyBook({ ISBN: "12345678901", AuthorId: author.id })),
        Book.create(dummyBook({ ISBN: "12345678902", AuthorId: author.id }))
      ]);
    });

    describe("readAllBooks - GET /books", function () {
      it("gets all the book records", async function () {
        const res = await req.get("/books");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((book) => {
          const expected = books.find((b) => b.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe("readSingleBookById - GET /books/:id", function () {
      it("gets a single book record by id", async function () {
        const [book] = books;
        const res = await req.get(`/books/${book.id}`);

        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal(book.title);
        expect(res.body.ISBN).to.equal(book.ISBN);
        expect(res.body.ReaderId).to.equal(null);
        expect(res.body.GenreId).to.equal(null);
      });

      it("returns a 404 if the book does not exist", async function () {
        const res = await req.get("/books/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The book could not be found 💥");
      });
    });

    describe("updateSingleBookById - PATCH /books/:id", function () {
      it("updates a single book record title by id", async function () {
        const [book] = books;
        const { title: newTitle } = dummyBook({});
        const res = await req
          .patch(`/books/${book.id}`)
          .send({ title: newTitle });
        const updatedBook = await Book.findByPk(book.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The book has been successfully updated 👍"
        );
        expect(updatedBook.title).to.equal(newTitle);
      });

      it("updates a single book record ISBN by id", async function () {
        const [book] = books;
        const { ISBN: newISBN } = dummyBook({});
        const res = await req
          .patch(`/books/${book.id}`)
          .send({ ISBN: newISBN });
        const updatedBook = await Book.findByPk(book.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The book has been successfully updated 👍"
        );
        expect(updatedBook.ISBN).to.equal(newISBN);
      });

      it("returns a 400 if the updated title is empty", async function () {
        const [book] = books;
        const res = await req.patch(`/books/${book.id}`).send({ title: "" });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'title' 👎"]);
      });

      it("returns a 404 if the book does not exist", async function () {
        const { ISBN: newISBN } = dummyBook({});
        const res = await req.patch("/books/9999").send({ ISBN: newISBN });

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The book could not be found 💥");
      });
    });

    describe("deleteSingleBookById - DELETE /books/:id", function () {
      it("deletes a single book record by id", async function () {
        const [book] = books;
        const res = await req.delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(res.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if the book does not exist", async function () {
        const res = await req.delete("/books/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The book could not be found 💥");
      });
    });
  });
});
