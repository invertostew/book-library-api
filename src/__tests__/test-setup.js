const path = require("path");

const dotenv = require("dotenv");

const envFile = "../../.env.test";

dotenv.config({
  path: path.join(__dirname, envFile)
});
