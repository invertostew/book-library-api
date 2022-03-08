const { describe, it } = require("mocha");
const { expect } = require("chai");

const removeObjectProperty = require("../../helpers/remove-object-property");

describe("removeObjectProperty", function () {
  it("removes a given property from an object", function () {
    const object = {
      prop1: "Prop1",
      prop2: "Prop2"
    };

    const removedPropObject = removeObjectProperty("prop1", object);

    expect(removedPropObject).to.eql({ prop2: "Prop2" });
  });

  it("removes a given property from an object", function () {
    const object = {
      name: "name",
      email: "email",
      password: "password"
    };

    const removedPropObject = removeObjectProperty("password", object);

    expect(removedPropObject).to.eql({ name: "name", email: "email" });
  });
});
