const connection = require("../db/connection.js");

function fetchTopics() {
  return connection
    .select("*")
    .from("topics")
    .returning("*")
    .then(result => {
      return result;
    });
}

module.exports = { fetchTopics };
