const { describe, it, before, beforeEach } = require("mocha");
const { expect } = require("chai");
const supertest = require("supertest");

const { Author } = require("../../models/index");
const { dummyAuthor } = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("authors.controller", function () {
  before(async function () {
    await Author.sequelize.sync();
  });

  beforeEach(async function () {
    await Author.destroy({ where: {} });
  });

  describe("without records in the database", function () {
    describe("createNewAuthor - POST /authors", function () {
      it("creates a new author in the database", async function () {
        const authorReqBody = dummyAuthor({});
        const res = await req.post("/authors").send(authorReqBody);
        const author = await Author.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(author.author).to.equal(authorReqBody.author);
      });

      it("returns a 400 if the request body is empty", async function () {
        const res = await req.post("/authors").send({});

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'author' 👎"
        ]);
      });

      it("returns a 400 if the author is empty", async function () {
        const { author } = dummyAuthor({ author: " " });
        const res = await req.post("/authors").send({ author });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'author' 👎"
        ]);
      });

      it("returns a 400 if the author is not unique", async function () {
        const authorReqBody = dummyAuthor({});
        await req.post("/authors").send(authorReqBody);
        const res = await req.post("/authors").send(authorReqBody);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "The 'author' field must be unique 👎"
        ]);
      });
    });
  });

  describe("with records in the database", function () {
    let authors;

    beforeEach(async function () {
      authors = await Promise.all([
        Author.create(dummyAuthor({})),
        Author.create(dummyAuthor({})),
        Author.create(dummyAuthor({}))
      ]);
    });

    describe("readAllAuthors - GET /authors", function () {
      it("gets all the author records", async function () {
        const res = await req.get("/authors");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.author).to.equal(expected.author);
        });
      });
    });

    describe("readSingleAuthorById - GET /authors/:id", function () {
      it("gets a single author record by id", async function () {
        const [author] = authors;
        const res = await req.get(`/authors/${author.id}`);

        expect(res.status).to.equal(200);
        expect(res.body.author).to.equal(author.author);
      });

      it("returns a 404 if the author does not exist", async function () {
        const res = await req.get("/authors/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The author could not be found 💥");
      });
    });

    describe("updateSingleAuthorById - PATCH /authors/:id", function () {
      it("updates a single author record author by id", async function () {
        const [author] = authors;
        const { author: newAuthor } = dummyAuthor({});
        const res = await req
          .patch(`/authors/${author.id}`)
          .send({ author: newAuthor });
        const updatedAuthor = await Author.findByPk(author.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The author has been successfully updated 👍"
        );
        expect(updatedAuthor.author).to.equal(newAuthor);
      });

      it("returns a 400 if the updated author is empty", async function () {
        const [author] = authors;
        const res = await req
          .patch(`/authors/${author.id}`)
          .send({ author: "" });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'author' 👎"
        ]);
      });

      it("returns a 400 if the updated author already exists", async function () {
        const [author1, author2] = authors;
        const res = await req
          .patch(`/authors/${author1.id}`)
          .send({ author: author2.author });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "The 'author' field must be unique 👎"
        ]);
      });
    });

    describe("deleteSingleAuthorById - DELETE /authors/:id", function () {
      it("deletes a single author record by id", async function () {
        const [author] = authors;
        const res = await req.delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(res.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it("returns a 404 if the author does not exist", async function () {
        const res = await req.delete("/authors/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The author could not be found 💥");
      });
    });
  });
});
