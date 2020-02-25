const apiRouter = require("express").Router();

const { topicsRouter } = require();

apiRouter.route("/topics").get(topicsRouter);

module.exports = { apiRouter };
