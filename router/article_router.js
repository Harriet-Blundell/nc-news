const articleRouter = require("express").Router();

const {
  getArticleId,
  patchArticleVote,
  postArticleComment,
  getCommentsById,
  getArticles
} = require("../controllers/article.controller.js");

const { checkForInvalidKeys } = require("../middlewares/index.js");

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleId)
  .patch(patchArticleVote);

articleRouter
  .route("/:article_id/comments")
  .post(postArticleComment)
  .get(checkForInvalidKeys, getCommentsById);

module.exports = { articleRouter };
