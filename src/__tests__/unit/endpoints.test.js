const { expect } = require("chai");
const supertest = require("supertest");

const app = require("../../app");

const req = supertest(app);

describe("endpoint tests", () => {
  describe("/readers endpoints", () => {
    describe("POST /readers", () => {
      it("doesn't return a 404 Not Found", async () => {
        const res = await req.post("/readers");

        expect(res.status).to.not.equal(404);
      });
    });
  });
});
