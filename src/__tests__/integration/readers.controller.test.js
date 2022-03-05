const { expect } = require("chai");
const supertest = require("supertest");

const { Reader } = require("../../models/index");
const { dummyReader } = require("../../helpers/fake-data");
const app = require("../../app");

const req = supertest(app);

describe("readers.controller", () => {
  before(async () => {
    await Reader.sequelize.sync();
  });

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("createReader", () => {
    it("creates a new reader in the database", async () => {
      const reader = dummyReader({});

      const res = await req.post("/readers").send(reader);

      const readerRecord = await Reader.findByPk(res.body.id, {
        raw: true
      });

      expect(res.status).to.equal(201);
      expect(res.body.name).to.equal(reader.name);
      expect(readerRecord.name).to.equal(reader.name);
      expect(readerRecord.email).to.equal(reader.email);
    });
  });
});
