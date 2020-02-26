const commentRouter = require("express").Router();

const { patchCommentVote } = require("../controllers/comments.controller.js");

commentRouter.route("/:comment_id").patch(patchCommentVote);

module.exports = { commentRouter };
