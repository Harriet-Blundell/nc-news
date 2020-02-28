const {
  updateCommentVote,
  removeCommentById
} = require("../models/comments.models.js");

function patchCommentVote(req, res, next) {
  const { comment_id } = req.params;
  updateCommentVote(comment_id, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { patchCommentVote, deleteCommentById };
