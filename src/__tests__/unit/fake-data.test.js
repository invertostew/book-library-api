const { describe, it } = require("mocha");
const { expect } = require("chai");

const fakeData = require("../../helpers/fake-data");

describe("faker dummy data", function () {
  describe("dummyReader", function () {
    it("has default properties", function () {
      const dummyReader = fakeData.dummyReader({});

      expect(dummyReader.name).to.not.equal(undefined);
      expect(dummyReader.email).to.not.equal(undefined);
      expect(dummyReader.password).to.not.equal(undefined);
    });

    it("has default properties that can be overriden", function () {
      const dummyReader = fakeData.dummyReader({
        name: "Fred Fredburger",
        email: "fredfredburger@gmail.com",
        password: "FrozenYogurt"
      });

      expect(dummyReader.name).to.equal("Fred Fredburger");
      expect(dummyReader.email).to.equal("fredfredburger@gmail.com");
      expect(dummyReader.password).to.equal("FrozenYogurt");
    });
  });

  describe("dummyAuthor", function () {
    it("has default properties", function () {
      const dummyAuthor = fakeData.dummyAuthor({});

      expect(dummyAuthor.author).to.not.equal(undefined);
    });

    it("has default properties that can be overriden", function () {
      const dummyAuthor = fakeData.dummyAuthor({
        author: "George Orwell"
      });

      expect(dummyAuthor.author).to.equal("George Orwell");
    });
  });

  describe("dummyGenre", function () {
    it("has default properties", function () {
      const dummyGenre = fakeData.dummyGenre({});

      expect(dummyGenre.genre).to.not.equal(undefined);
    });

    it("has default properties that can be overriden", function () {
      const dummyGenre = fakeData.dummyGenre({
        genre: "Science Fiction"
      });

      expect(dummyGenre.genre).to.equal("Science Fiction");
    });
  });

  describe("dummyBook", function () {
    it("has default properties", function () {
      const dummyBook = fakeData.dummyBook({});

      expect(dummyBook.title).to.not.equal(undefined);
      expect(dummyBook.ISBN).to.not.equal(undefined);
      expect(dummyBook.ReaderId).to.equal(null);
      expect(dummyBook.GenreId).to.equal(null);
    });

    it("has default properties that can be overriden", function () {
      const dummyBook = fakeData.dummyBook({
        title: "Nineteen Eighty-Four",
        ISBN: "9780141393049"
      });

      expect(dummyBook.title).to.equal("Nineteen Eighty-Four");
      expect(dummyBook.ISBN).to.equal("9780141393049");
    });

    it("has optional ReaderId and GenreId properties", function () {
      const dummyBook = fakeData.dummyBook({
        ReaderId: 1,
        GenreId: 2
      });

      expect(dummyBook.ReaderId).to.equal(1);
      expect(dummyBook.GenreId).to.equal(2);
    });
  });
});
