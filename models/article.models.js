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
        return Promise.reject({ msg: "404 not found", status: 404 });
      }
      result[0].comment_count = +result[0].comment_count;
      return result[0];
    });
}

module.exports = { fetchArticleId };
