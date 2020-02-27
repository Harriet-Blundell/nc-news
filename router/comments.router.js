const commentRouter = require("express").Router();

const {
  patchCommentVote,
  deleteCommentById
} = require("../controllers/comments.controller.js");

const { send405Error } = require("../error/index.js");

commentRouter
  .route("/:comment_id")
  .patch(patchCommentVote)
  .delete(deleteCommentById)
  .all(send405Error);

module.exports = { commentRouter };
