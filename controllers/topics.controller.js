const { fetchTopics, createATopic } = require("../models/topics.models.js");

function getTopics(req, res, next) {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => {
      next(err);
    });
}

function postTopic(req, res, next) {
  const { slug, description } = req.body;

  createATopic(slug, description)
    .then(topic => {
      res.status(200).send({ topic });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { getTopics, postTopic };
