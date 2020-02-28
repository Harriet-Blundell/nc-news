const connection = require("../db/connection.js");

function fetchTopics() {
  return connection
    .select("*")
    .from("topics")
    .returning("*")
    .then(topicResult => {
      return topicResult;
    });
}

module.exports = { fetchTopics };
