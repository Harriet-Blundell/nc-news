const apiRouter = require("express").Router();

const { topicsRouter } = require("./topics_router.js");
const { userRouter } = require("./user_router.js");
const { articleRouter } = require("./article_router.js");
const { commentRouter } = require("./comments.router.js");
const { getDescriptionEndpoint } = require("../controllers/api.controller.js");

const { send405Error } = require("../error/index.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

apiRouter
  .route("/")
  .get(getDescriptionEndpoint)
  .all(send405Error);

module.exports = apiRouter;
