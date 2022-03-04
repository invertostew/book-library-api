const path = require("path");

const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

const envFile = "../../.env.test";

dotenv.config({
  path: path.join(__dirname, envFile)
});

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

async function dropDatabase() {
  try {
    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT
    });

    await db.query(`DROP DATABASE ${DB_NAME};`);

    await db.end();
  } catch (err) {
    console.log(
      `Your environment variables might be wrong. Please double check ${path.join(
        __dirname,
        envFile
      )}`
    );

    console.log("Environment variables are: ", {
      DB_HOST,
      DB_USER,
      DB_PASSWORD,
      DB_PORT,
      DB_NAME
    });

    console.log(err);
  }
}

dropDatabase();
