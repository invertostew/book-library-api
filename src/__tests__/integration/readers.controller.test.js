const { expect } = require("chai");
const supertest = require("supertest");

const { Reader } = require("../../models/index");
const { dummyReader } = require("../../helpers/fake-data");
const app = require("../../app");
const { describe, it, before, after } = require("mocha");

const req = supertest(app);

describe("readers.controller", function () {
  before(async function () {
    await Reader.sequelize.sync();
  });

  describe("createReader", function () {
    after(async function () {
      await Reader.destroy({ where: {} });
    });

    it("creates a new reader in the database", async function () {
      const reader = dummyReader({});

      const res = await req.post("/readers").send(reader);

      const readerRecord = await Reader.findByPk(res.body.id, {
        raw: true
      });

      expect(res.status).to.equal(201);
      expect(readerRecord.name).to.equal(reader.name);
      expect(readerRecord.email).to.equal(reader.email);
    });

    it("returns a 400 if the request body is empty", async function () {
      const res = await req.post("/readers").send({});

      expect(res.status).to.equal(400);
    });

    it("returns a 400 if the request body is missing name", async function () {
      const email = dummyReader({}).email;

      const res = await req.post("/readers").send({ email });

      expect(res.status).to.equal(400);
    });

    it("returns a 400 if the request body is missing email", async function () {
      const name = dummyReader({}).name;

      const res = await req.post("/readers").send({ name });

      expect(res.status).to.equal(400);
    });

    it("returns a 400 if the email address exists in the database", async function () {
      const name = dummyReader({}).name;

      const readerRecord = await Reader.findByPk(1, {
        raw: true
      });

      const readerRecordEmail = readerRecord.email;

      const res = await req
        .post("/readers")
        .send({ name, email: readerRecordEmail });

      expect(res.status).to.equal(400);
    });
  });

  describe("readReaders", function () {
    xit("gets all the reader records", async function () {
      // code
    });
  });

  describe("readReader", function () {
    xit("gets a single reader record by id", async function () {
      // code
    });
  });

  describe("updateReader", function () {
    xit("updates a single reader records email by id", async function () {
      // code
    });
  });

  describe("deleteReader", function () {
    xit("deletes a single reader record by id", async function () {
      // code
    });
  });
});
