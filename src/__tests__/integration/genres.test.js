const { describe, it, before, beforeEach } = require("mocha");
const { expect } = require("chai");
const supertest = require("supertest");

const { Genre } = require("../../models/index");
const { dummyGenre } = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("genres.controller", function () {
  before(async function () {
    await Genre.sequelize.sync();
  });

  beforeEach(async function () {
    await Genre.destroy({ where: {} });
  });

  describe("without records in the database", function () {
    describe("createNewGenre - POST /genres", function () {
      it("creates a new genre in the database", async function () {
        const genreReqBody = dummyGenre({});
        const res = await req.post("/genres").send(genreReqBody);
        const genre = await Genre.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(genre.genre).to.equal(genreReqBody.genre);
      });

      it("returns a 400 if the request body is empty", async function () {
        const res = await req.post("/genres").send({});

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'genre' 👎"]);
      });

      it("returns a 400 if the genre is empty", async function () {
        const { genre } = dummyGenre({ genre: " " });
        const res = await req.post("/genres").send({ genre });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'genre' 👎"]);
      });

      it("returns a 400 if the genre is not unique", async function () {
        const genreReqBody = dummyGenre({});
        await req.post("/genres").send(genreReqBody);
        const res = await req.post("/genres").send(genreReqBody);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "The 'genre' field must be unique 👎"
        ]);
      });
    });
  });

  describe("with records in the database", function () {
    let genres;

    beforeEach(async function () {
      genres = await Promise.all([
        Genre.create(dummyGenre({})),
        Genre.create(dummyGenre({})),
        Genre.create(dummyGenre({}))
      ]);
    });

    describe("readAllGenres - GET /genres", function () {
      it("gets all the genre records", async function () {
        const res = await req.get("/genres");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((genre) => {
          const expected = genres.find((g) => g.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
          expect(genre.Books).to.eql([]);
        });
      });
    });

    describe("readSingleGenreById - GET /genres/:id", function () {
      it("gets a single genre record by id", async function () {
        const [genre] = genres;
        const res = await req.get(`/genres/${genre.id}`);

        expect(res.status).to.equal(200);
        expect(res.body.genre).to.equal(genre.genre);
      });

      it("returns a 404 if the genre does not exist", async function () {
        const res = await req.get("/genres/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The genre could not be found 💥");
      });
    });

    describe("updateSingleGenreById - PATCH /genres/:id", function () {
      it("updates a single genre record genre by id", async function () {
        const [genre] = genres;
        const { genre: newGenre } = dummyGenre({});
        const res = await req
          .patch(`/genres/${genre.id}`)
          .send({ genre: newGenre });
        const updatedGenre = await Genre.findByPk(genre.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The genre has been successfully updated 👍"
        );
        expect(updatedGenre.genre).to.equal(newGenre);
      });

      it("returns a 400 if the updated genre is empty", async function () {
        const [genre] = genres;
        const res = await req.patch(`/genres/${genre.id}`).send({ genre: "" });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'genre' 👎"]);
      });

      it("returns a 400 if the updated genre already exists", async function () {
        const [genre1, genre2] = genres;
        const res = await req
          .patch(`/genres/${genre1.id}`)
          .send({ genre: genre2.genre });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "The 'genre' field must be unique 👎"
        ]);
      });
    });

    describe("deleteSingleGenreById - DELETE /genres/:id", function () {
      it("deletes a single genre record by id", async function () {
        const [genre] = genres;
        const res = await req.delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(res.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it("returns a 404 if the genre does not exist", async function () {
        const res = await req.delete("/genres/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The genre could not be found 💥");
      });
    });
  });
});
