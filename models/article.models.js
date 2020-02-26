const connection = require("../db/connection.js");

function fetchArticleId(article_id) {
  return connection("articles")
    .where("articles.article_id", article_id)
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }
      result[0].comment_count = +result[0].comment_count;
      return result[0];
    });
}

function updateArticleVote(body, article_id) {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", body.inc_votes)
    .returning("*")
    .then(updateVote => {
      console.log(updateVote);
      if (updateVote.length === 0) {
        return Promise.reject({ msg: "ID not found", status: 404 });
      }
      return updateVote[0];
    });
}

function createArticleComment(article_id, newComment) {
  return connection
    .insert({
      author: newComment.username,
      article_id: article_id,
      body: newComment.body
    })
    .into("comments")
    .returning("*")
    .then(result => {
      return result[0];
    });
}

function fetchCommentsById(sort_by, order_by, article_id) {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order_by || "desc")
    .then(commentOrdered => {
      return commentOrdered;
    });
}

function fetchArticles() {}

module.exports = {
  fetchArticleId,
  updateArticleVote,
  createArticleComment,
  fetchCommentsById,
  fetchArticles
};
