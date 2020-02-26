const articleRouter = require("express").Router();

const {
  getArticleId,
  patchArticleVote,
  postArticleComment
} = require("../controllers/article.controller.js");

articleRouter
  .route("/:article_id")
  .get(getArticleId)
  .patch(patchArticleVote);

// articleRouter.route("/:article_id/comments").post(postArticleComment);

module.exports = { articleRouter };
