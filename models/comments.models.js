const connection = require("../db/connection.js");

function updateCommentVote(comment_id, newVote) {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", newVote.inc_votes)
    .returning("*")
    .then(commentResult => {
      if (commentResult.length === 0) {
        return Promise.reject({ msg: "Not Found", status: 404 });
      }
      return commentResult[0];
    });
}

function removeCommentById(comment_id) {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(comment => {
      if (comment <= 0) {
        return Promise.reject({ msg: "Not Found", status: 404 });
      }
    });
}

module.exports = { updateCommentVote, removeCommentById };
