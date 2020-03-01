const connection = require("../db/connection.js");

function updateCommentVote(comment_id, newVote) {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", newVote.inc_votes || 0)
    .returning("*")
    .then(commentResult => {
      if (commentResult.length === 0) {
        return Promise.reject({ msg: "Comment ID Not Found", status: 404 });
      }
      return commentResult[0];
    });
}

function removeCommentById(comment_id) {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(removeComment => {
      if (removeComment <= 0) {
        return Promise.reject({ msg: "Comment ID Not Found", status: 404 });
      }
    });
}

module.exports = { updateCommentVote, removeCommentById };
