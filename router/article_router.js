const articleRouter = require("express").Router();

const {
  getArticleId,
  patchArticleVote,
  postArticleComment,
  getCommentsById,
  getArticles,
  deleteArticleById,
  postArticle
} = require("../controllers/article.controller.js");

const { checkForInvalidKeys } = require("../middlewares/index.js");

const { send405Error } = require("../error/index");

articleRouter
  .route("/")
  .get(checkForInvalidKeys, getArticles)
  .post(postArticle)
  .all(send405Error);

articleRouter
  .route("/:article_id")
  .get(getArticleId)
  .patch(patchArticleVote)
  .delete(deleteArticleById)
  .all(send405Error);

articleRouter
  .route("/:article_id/comments")
  .post(postArticleComment)
  .get(checkForInvalidKeys, getCommentsById)
  .all(send405Error);

module.exports = { articleRouter };
