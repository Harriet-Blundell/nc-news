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

function createATopic(slug, description) {
  return connection("topics")
    .insert({
      slug: slug,
      description: description
    })
    .into("topics")
    .returning("*")
    .then(newTopic => {
      return newTopic;
    });
}

module.exports = { fetchTopics, createATopic };
