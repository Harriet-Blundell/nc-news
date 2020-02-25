const { fetchTopics } = require("../models/topics.models.js");

function getTopics(req, res, next) {
  fetchTopics().then(topics => {
    console.log({ topics });
    res.status(200).send({ topics });
  });
}

module.exports = { getTopics };
