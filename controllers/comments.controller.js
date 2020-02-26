const { updateCommentVote } = require("../models/comments.models.js");

function patchCommentVote(req, res, next) {
  const { comment_id } = req.params;
  updateCommentVote(comment_id, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { patchCommentVote };
