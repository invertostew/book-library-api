const { describe, it, before, beforeEach } = require("mocha");
const { expect } = require("chai");
const supertest = require("supertest");

const { Book } = require("../../models/index");
const { dummyBook } = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("books.controller", function () {
  before(async function () {
    await Book.sequelize.sync();
  });

  beforeEach(async function () {
    await Book.destroy({ where: {} });
  });

  describe("without records in the database", function () {
    describe("createNewBook - POST /books", function () {
      it("creates a new book in the database", async function () {
        const bookReqBody = dummyBook({});
        const res = await req.post("/books").send(bookReqBody);
        const book = await Book.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(book.title).to.equal(bookReqBody.title);
        expect(book.author).to.equal(bookReqBody.author);
        expect(book.genre).to.equal(bookReqBody.genre);
        expect(book.ISBN).to.equal(bookReqBody.ISBN);
      });

      it("returns a 400 if the request body is empty", async function () {
        const res = await req.post("/books").send({});

        expect(res.status).to.equal(400);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal(
          "Missing required fields: 'title' or 'author'"
        );
      });

      it("returns a 400 if the request body is missing title", async function () {
        const { author } = dummyBook({});
        const res = await req.post("/books").send({ author });

        expect(res.status).to.equal(400);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal(
          "Missing required fields: 'title' or 'author'"
        );
      });

      it("returns a 400 if the request body is missing author", async function () {
        const { title } = dummyBook({});
        const res = await req.post("/books").send({ title });

        expect(res.status).to.equal(400);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal(
          "Missing required fields: 'title' or 'author'"
        );
      });
    });
  });

  describe("with records in the database", function () {
    let books;

    beforeEach(async function () {
      books = await Promise.all([
        Book.create(dummyBook({})),
        Book.create(dummyBook({})),
        Book.create(dummyBook({}))
      ]);
    });

    describe("readAllBooks - GET /books", function () {
      it("gets all the book records", async function () {
        const res = await req.get("/books");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
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
        expect(res.body.author).to.equal(book.author);
        expect(res.body.genre).to.equal(book.genre);
        expect(res.body.ISBN).to.equal(book.ISBN);
      });

      it("returns a 404 if the book does not exist", async function () {
        const res = await req.get("/books/9999");

        expect(res.status).to.equal(404);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal("The book could not be found");
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
        expect(res.body.type).to.equal("success");
        expect(res.body.message).to.equal(
          "The book has been successfully updated"
        );
        expect(updatedBook.title).to.equal(newTitle);
      });

      it("updates a single book record author by id", async function () {
        const [book] = books;
        const { author: newAuthor } = dummyBook({});
        const res = await req
          .patch(`/books/${book.id}`)
          .send({ author: newAuthor });
        const updatedBook = await Book.findByPk(book.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.type).to.equal("success");
        expect(res.body.message).to.equal(
          "The book has been successfully updated"
        );
        expect(updatedBook.author).to.equal(newAuthor);
      });

      it("updates a single book record genre and ISBN by id", async function () {
        const [book] = books;
        const { genre: newGenre, ISBN: newISBN } = dummyBook({});
        const res = await req
          .patch(`/books/${book.id}`)
          .send({ genre: newGenre, ISBN: newISBN });
        const updatedBook = await Book.findByPk(book.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.type).to.equal("success");
        expect(res.body.message).to.equal(
          "The book has been successfully updated"
        );
        expect(updatedBook.genre).to.equal(newGenre);
        expect(updatedBook.ISBN).to.equal(newISBN);
      });

      it("returns a 500 if the updated title is empty", async function () {
        const [book] = books;
        const res = await req.patch(`/books/${book.id}`).send({ title: "" });

        expect(res.status).to.equal(500);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal(
          "Validation error: Validation notEmpty on title failed"
        );
      });

      it("returns a 500 if the updated author is empty", async function () {
        const [book] = books;
        const res = await req.patch(`/books/${book.id}`).send({ author: "" });

        expect(res.status).to.equal(500);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal(
          "Validation error: Validation notEmpty on author failed"
        );
      });

      it("returns a 404 if the book does not exist", async function () {
        const { ISBN: newISBN } = dummyBook({});
        const res = await req.patch("/books/9999").send({ ISBN: newISBN });

        expect(res.status).to.equal(404);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal("The book could not be found");
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
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal("The book could not be found");
      });
    });
  });
});
