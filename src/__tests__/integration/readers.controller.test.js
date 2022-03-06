const { describe, it, xit, before, beforeEach } = require("mocha");
const { expect } = require("chai");
const supertest = require("supertest");

const { Reader } = require("../../models/index");
const { dummyReader } = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("readers.controller", function () {
  before(async function () {
    await Reader.sequelize.sync();
  });

  beforeEach(async function () {
    await Reader.destroy({ where: {} });
  });

  describe("without records in the database", function () {
    describe("createNewReader - POST /readers", function () {
      it("creates a new reader in the database", async function () {
        const reader = dummyReader({});
        const res = await req.post("/readers").send(reader);
        const newReader = await Reader.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(newReader.name).to.equal(reader.name);
        expect(newReader.email).to.equal(reader.email);
        expect(newReader.password).to.equal(reader.password);
      });

      it("returns a 400 if the request body is empty", async function () {
        const res = await req.post("/readers").send({});

        expect(res.status).to.equal(400);
      });

      it("returns a 400 if the request body is missing name", async function () {
        const { email } = dummyReader({});
        const res = await req.post("/readers").send({ email });

        expect(res.status).to.equal(400);
      });

      it("returns a 400 if the request body is missing email", async function () {
        const { name } = dummyReader({});
        const res = await req.post("/readers").send({ name });

        expect(res.status).to.equal(400);
      });

      it("returns a 400 if the request body is missing password", async function () {
        const { name, email } = dummyReader({});
        const res = await req.post("/readers").send({ name, email });

        expect(res.status).to.equal(400);
      });
    });
  });

  describe("with records in the database", function () {
    let readers;

    beforeEach(async function () {
      readers = await Promise.all([
        Reader.create(dummyReader({})),
        Reader.create(dummyReader({})),
        Reader.create(dummyReader({}))
      ]);
    });

    describe("createNewReader - POST /readers", function () {
      xit("returns a 400 if the email address exists in the database", async function () {
        const reader = readers[0];
        const newReaderWithUsedEmailAddress = dummyReader({
          email: reader.email
        });
        const res = await req.post("/readers").send({
          name: newReaderWithUsedEmailAddress.name,
          email: newReaderWithUsedEmailAddress.email,
          password: newReaderWithUsedEmailAddress.password
        });

        expect(res.status).to.equal(400);
      });
    });

    describe("readAllReaders - GET /readers", function () {
      it("gets all the reader records", async function () {
        const res = await req.get("/readers");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
        });
      });
    });

    describe("readSingleReaderById - GET /readers/:id", function () {
      it("gets a single reader record by id", async function () {
        const reader = readers[0];
        const res = await req.get(`/readers/${reader.id}`);

        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(reader.name);
        expect(res.body.email).to.equal(reader.email);
      });

      it("returns a 404 if the reader does not exist", async function () {
        const res = await req.get("/readers/9999");

        expect(res.status).to.equal(404);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal("The reader could not be found");
      });
    });

    describe("updateSingleReaderById - PATCH /readers/:id", function () {
      it("updates a single reader record name by id", async function () {
        const reader = readers[0];
        const { name: newName } = dummyReader({});
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ name: newName });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(updatedReader.name).to.equal(newName);
      });

      it("updates a single reader record email by id", async function () {
        const reader = readers[0];
        const { email: newEmail } = dummyReader({});
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ email: newEmail });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(updatedReader.email).to.equal(newEmail);
      });

      it("updates a single reader record name and email by id", async function () {
        const reader = readers[0];
        const { name: newName, email: newEmail } = dummyReader({});
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ name: newName, email: newEmail });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(updatedReader.name).to.equal(newName);
        expect(updatedReader.email).to.equal(newEmail);
      });

      it("returns a 404 if the reader does not exist", async function () {
        const { email: newEmail } = dummyReader({});
        const res = await req.patch("/readers/9999").send({ email: newEmail });

        expect(res.status).to.equal(404);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal("The reader could not be found");
      });
    });

    describe("deleteSingleReaderById - DELETE /readers/:id", function () {
      it("deletes a single reader record by id", async function () {
        const reader = readers[0];
        const res = await req.delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(res.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the reader does not exist", async function () {
        const res = await req.delete("/readers/9999");

        expect(res.status).to.equal(404);
        expect(res.body.type).to.equal("error");
        expect(res.body.message).to.equal("The reader could not be found");
      });
    });
  });
});
