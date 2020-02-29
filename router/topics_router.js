const topicsRouter = require("express").Router();

const { getTopics, postTopic } = require("../controllers/topics.controller.js");

const { send405Error } = require("../error/index.js");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(send405Error);

module.exports = { topicsRouter };
