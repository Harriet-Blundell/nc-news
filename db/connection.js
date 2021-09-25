const knex = require("knex");
const { DATABASE_URL } = process.env;

const dbConfig =
  process.env.NODE_ENV === "production"
    ? { client: "pg", connection: `${DATABASE_URL}?ssl=true` }
    : require("../knexfile.js");

module.exports = knex(dbConfig);
