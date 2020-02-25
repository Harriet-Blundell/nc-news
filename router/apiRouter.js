const apiRouter = require("express").Router();

const { topicsRouter } = require("./topics_router.js");
const { userRouter } = require("./user_router.js");
const { articleRouter } = require("./article_router.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);

module.exports = { apiRouter };
