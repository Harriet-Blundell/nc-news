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
      if (updateVote.length === 0) {
        return Promise.reject({ msg: "ID not found", status: 404 });
      }
      return updateVote[0];
    });
}

function createArticleComment(article_id, body) {
  return connection
    .insert(body)
    .into("comments")
    .returning("*")
    .then(result => {
      console.log(result, "in the model");
    });
}

module.exports = { fetchArticleId, updateArticleVote, createArticleComment };
