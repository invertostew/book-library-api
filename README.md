# MCR Codes Book Library API

This is my Book Library API project for [Manchester Codes](https://www.manchestercodes.com/) as part of the Backend module.

## Description

The main purpose of this project is to:

- Learn how to take user stories and turn them into requirements.
- Expand my knowledge of database design.
- Learn how to use Sequelize to perform SQL queries.
- Learn how to use the Sequelize documentation to implement validation on models.

## Features

More later...

## Requirements

More later...

### Application Dependencies

More later...

### Development Dependencies

More later...

## Getting Started

- Pull down a MySQL image from DockerHub
  - `docker pull bbatm9/music_library_mysql`
  - more info: [DockerHub](https://hub.docker.com/r/bbatm9/music_library_mysql)
- Set up the container
  - `docker run -d -p <OUTSIDE_PORT>:<INSIDE_PORT> --name <NAME> -e MYSQL_ROOT_PASSWORD=<PASSWORD> <IMAGE_NAME>`
- Clone this repo
- Change into the repo directory
- Install the dependencies from `package-lock.json`
  - `npm install`
- Create an `.env` and `.env.test` file in the project root
  - `touch .env && touch .env.test`
- Add the following to both `.env` and `.env.test`, switching out `<VALUE>` as necessary
  - `DB_HOST=<YOUR_DB_HOST>`
  - `DB_USER=<YOUR_DB_USER>`
  - `DB_PASSWORD=<YOUR_DB_PASSWORD>`
  - `DB_PORT=<YOUR_DB_PORT>` (as specified in the `docker run` command)
  - `DB_NAME=<YOUR_DB_NAME>`
  - `APP_PORT=<YOUR_APP_PORT>` (optional, will default to 4000)
  - IMPORTANT: Ensure `DB_NAME` is different in `.env` than it is in `.env.test`, the database in `.env.test` will be dropped each time.
- Start the production server
  - `npm start`

## Documentation

### Readers

| HTTP Verb | Route        | Example Request Body                                         | Required Fields       |
| --------- | ------------ | ------------------------------------------------------------ | --------------------- |
| GET       | /readers     | N/A                                                          | N/A                   |
| POST      | /readers     | {"name": "Name", "email": "email@email.com", "password": "myPassword"} | name, email, password |
| GET       | /readers/:id | N/A                                                          | N/A                   |
| PATCH     | /readers/:id | {"password": "myNewPassword"}                                | N/A                   |
| DELETE    | /readers/:id | N/A                                                          | N/A                   |

### Books

| HTTP Verb | Route      | Example Request Body                                         | Required Fields |
| --------- | ---------- | ------------------------------------------------------------ | --------------- |
| GET       | /books     | N/A                                                          | N/A             |
| POST      | /books     | {"title": "Title", "author": "Author", "genre": "Genre", "ISBN", "ISBN"} | title, author   |
| GET       | /books/:id | N/A                                                          | N/A             |
| PATCH     | /books/:id | {"title": "Updated Title"}                                   | N/A             |
| DELETE    | /books/:id | N/A                                                          | N/A             |

## Testing

Built using a TDD approach. Tests are focused on integration testing. Each controller was first written as a failing test, which was then built out as per the tests, and later refactored and tested again.

All tests are located inside of the `./src/__tests__` directory.

If you wish to run the tests for yourself, you can install Mocha, Chai and SuperTest by running `npm install` and from there you can run the tests by running `npm test`.

I also used [Insomnia](https://insomnia.rest/) to send requests to my RESTful API endpoints as documented above.
