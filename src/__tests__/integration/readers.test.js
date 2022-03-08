const { describe, it, before, beforeEach } = require("mocha");
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
        const readerReqBody = dummyReader({});
        const res = await req.post("/readers").send(readerReqBody);
        const reader = await Reader.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(reader.name).to.equal(readerReqBody.name);
        expect(reader.email).to.equal(readerReqBody.email);
        expect(reader.password).to.equal(readerReqBody.password);
      });

      it("doesn't return the password to the user", async function () {
        const readerReqBody = dummyReader({});
        const res = await req.post("/readers").send(readerReqBody);
        const reader = await Reader.findByPk(res.body.id, {
          raw: true
        });

        expect(res.status).to.equal(201);
        expect(reader.password).to.equal(readerReqBody.password);
        expect(res.body.password).to.equal(undefined);
      });

      it("returns a 400 if the request body is empty", async function () {
        const res = await req.post("/readers").send({});

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'name' 👎",
          "Missing required field: 'email' 👎",
          "Missing required field: 'password' 👎"
        ]);
      });

      it("returns a 400 if the request body is missing name", async function () {
        const { email, password } = dummyReader({});
        const res = await req.post("/readers").send({ email, password });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'name' 👎"]);
      });

      it("returns a 400 if the request body is missing email", async function () {
        const { name, password } = dummyReader({});
        const res = await req.post("/readers").send({ name, password });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'email' 👎"]);
      });

      it("returns a 400 if the request body is missing password", async function () {
        const { name, email } = dummyReader({});
        const res = await req.post("/readers").send({ name, email });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'password' 👎"
        ]);
      });

      it("returns a 400 if the email is an invalid format", async function () {
        const { name, email, password } = dummyReader({
          email: "imnotanemail"
        });
        const res = await req.post("/readers").send({ name, email, password });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "You have provided an invalid email format 👎"
        ]);
      });

      it("returns a 400 if the password is less than 8 characters long", async function () {
        const { name, email, password } = dummyReader({ password: "short" });
        const res = await req.post("/readers").send({ name, email, password });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Password must be more than 8 characters, but less than 64 characters 👎"
        ]);
      });

      it("returns a 400 if the password is more than 64 characters long", async function () {
        const { name, email, password } = dummyReader({
          password:
            "ik80oKuAG5ngi6JokwCqExWs9oljjlmS0n26jG1eCHY9KhOdtCNQLPmNKuCtZl00X"
        });
        const res = await req.post("/readers").send({ name, email, password });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Password must be more than 8 characters, but less than 64 characters 👎"
        ]);
      });

      it("returns a 400 if the email is not unique", async function () {
        const readerReqBody = dummyReader({});
        await req.post("/readers").send(readerReqBody);
        const res = await req.post("/readers").send(readerReqBody);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "The 'email' field must be unique 👎"
        ]);
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

    describe("readAllReaders - GET /readers", function () {
      it("gets all the reader records (without the passwords)", async function () {
        const res = await req.get("/readers");

        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);

        res.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(undefined);
        });
      });
    });

    describe("readSingleReaderById - GET /readers/:id", function () {
      it("gets a single reader record by id (without the password)", async function () {
        const [reader] = readers;
        const res = await req.get(`/readers/${reader.id}`);

        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(reader.name);
        expect(res.body.email).to.equal(reader.email);
        expect(res.body.password).to.equal(undefined);
      });

      it("returns a 404 if the reader does not exist", async function () {
        const res = await req.get("/readers/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The reader could not be found 💥");
      });
    });

    describe("updateSingleReaderById - PATCH /readers/:id", function () {
      it("updates a single reader record name by id", async function () {
        const [reader] = readers;
        const { name: newName } = dummyReader({});
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ name: newName });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The reader has been successfully updated 👍"
        );
        expect(updatedReader.name).to.equal(newName);
      });

      it("updates a single reader record email by id", async function () {
        const [reader] = readers;
        const { email: newEmail } = dummyReader({});
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ email: newEmail });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The reader has been successfully updated 👍"
        );
        expect(updatedReader.email).to.equal(newEmail);
      });

      it("updates a single reader record name and email by id", async function () {
        const [reader] = readers;
        const { name: newName, email: newEmail } = dummyReader({});
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ name: newName, email: newEmail });
        const updatedReader = await Reader.findByPk(reader.id, {
          raw: true
        });

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "The reader has been successfully updated 👍"
        );
        expect(updatedReader.name).to.equal(newName);
        expect(updatedReader.email).to.equal(newEmail);
      });

      it("returns a 400 if the updated name is empty", async function () {
        const [reader] = readers;
        const res = await req.patch(`/readers/${reader.id}`).send({ name: "" });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql(["Missing required field: 'name' 👎"]);
      });

      it("returns a 400 if the updated email is empty", async function () {
        const [reader] = readers;
        const res = await req
          .patch(`/readers/${reader.id}`)
          .send({ email: "" });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "Missing required field: 'email' 👎",
          "You have provided an invalid email format 👎"
        ]);
      });

      it("returns a 404 if the reader does not exist", async function () {
        const { email: newEmail } = dummyReader({});
        const res = await req.patch("/readers/9999").send({ email: newEmail });

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The reader could not be found 💥");
      });

      it("returns a 400 if the updated email already exists", async function () {
        const [readers1, readers2] = readers;
        const res = await req
          .patch(`/readers/${readers1.id}`)
          .send({ email: readers2.email });

        expect(res.status).to.equal(400);
        expect(res.body.message).to.eql([
          "The 'email' field must be unique 👎"
        ]);
      });
    });

    describe("deleteSingleReaderById - DELETE /readers/:id", function () {
      it("deletes a single reader record by id", async function () {
        const [reader] = readers;
        const res = await req.delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(res.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the reader does not exist", async function () {
        const res = await req.delete("/readers/9999");

        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal("The reader could not be found 💥");
      });
    });
  });
});
