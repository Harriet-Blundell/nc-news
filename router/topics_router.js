const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics.controller.js");

const { send405Error } = require("../error/index.js");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = { topicsRouter };
