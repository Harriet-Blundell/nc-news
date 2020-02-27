const commentRouter = require("express").Router();

const {
  patchCommentVote,
  deleteCommentById
} = require("../controllers/comments.controller.js");

commentRouter
  .route("/:comment_id")
  .patch(patchCommentVote)
  .delete(deleteCommentById);

module.exports = { commentRouter };
