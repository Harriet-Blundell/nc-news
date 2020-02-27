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

function fetchArticles(
  sort_by = "created_at",
  order_by = "desc",
  topic,
  author
) {
  return connection("articles")
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .orderBy(sort_by, order_by)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(queries => {
      if (topic) {
        queries.where("articles.topic", "=", topic);
      } else if (author) {
        queries.where("articles.author", "=", author);
      }
    })
    .then(result => {
      console.log(result);
      return result;
    });
}

function checkIfExists(value, column, table) {
  console.log(value, column, table);

  return connection
    .select("*")
    .from(table)
    .where(column, "=", value)
    .then(result => {
      if (result.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
}

module.exports = {
  fetchArticleId,
  updateArticleVote,
  createArticleComment,
  fetchCommentsById,
  fetchArticles,
  checkIfExists
};
